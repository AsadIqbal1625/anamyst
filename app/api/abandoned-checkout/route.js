import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import AbandonedCheckout from "../../../models/AbandonedCheckout";
import { rateLimit } from "../../../lib/rateLimit";

/* The admin list renders these images through next/image, which throws
   on any host that isn't allow-listed — a stranger could otherwise store
   a foreign URL here and crash the admin page. Only our own Cloudinary
   images (or nothing) are kept. */
function safeImage(value) {
  const url = String(value || "").slice(0, 300);
  return url.startsWith("https://res.cloudinary.com/") ? url : "";
}

/* PUBLIC: called from two places —
   1. every cart change (session id + cart, no contact known yet)
   2. the checkout page once a contact has been typed, which enriches
      the same session's record.

   Keyed on sessionId so anonymous carts are recorded too; falls back
   to phone/email for older clients that send no session id. */
export async function POST(req) {
  try {
    /* public + writes to the DB, so cap per-IP volume */
    const limited = await rateLimit(req, "abandoned", 120);
    if (limited) return limited;

    const body = await req.json();

    const sessionId = String(body.sessionId || "").trim().slice(0, 64);

    const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 12);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 100);

    const validPhone = phone.length >= 10;
    const validEmail = /^\S+@\S+\.\S+$/.test(email);

    const cart = Array.isArray(body.cart) ? body.cart.slice(0, 30) : [];

    /* need a cart, and some way to identify the record */
    if (cart.length === 0 || (!sessionId && !validPhone && !validEmail)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const safeCart = cart.map((i) => ({
      productId: String(i.productId || i._id || ""),
      name: String(i.name || "").slice(0, 120),
      image: safeImage(i.image),
      price: Math.min(Math.max(Number(i.price) || 0, 0), 1000000),
      quantity: Math.min(
        Math.max(1, Math.floor(Number(i.quantity) || 1)),
        100
      ),
    }));

    const cartValue = safeCart.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );

    await connectDB();

    const filter = sessionId
      ? { sessionId }
      : validPhone
      ? { phone }
      : { email };

    /* contact details only overwrite when actually supplied, so a
       later anonymous cart ping cannot wipe a known contact */
    const update = {
      cart: safeCart,
      cartValue,
      lastActiveAt: new Date(),
      /* a fresh cart after a purchase is a new opportunity */
      recoveredAt: null,
    };

    if (sessionId) update.sessionId = sessionId;
    if (validPhone) update.phone = phone;
    if (validEmail) update.email = email;
    if (body.name) update.name = String(body.name).slice(0, 80);

    await AbandonedCheckout.findOneAndUpdate(
      filter,
      { $set: update },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    /* a racing upsert on the same session can trip the unique index —
       harmless, the other write already recorded the cart */
    if (error?.code === 11000) {
      return NextResponse.json({ success: true });
    }

    console.error("abandoned-checkout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/* ADMIN (gated by proxy.js): list abandoned checkouts + summary */
export async function GET() {
  try {
    await connectDB();

    /* still-open carts (a recovered one became an order) */
    const items = await AbandonedCheckout.find({ recoveredAt: null })
      .sort({ lastActiveAt: -1 })
      .limit(200)
      .lean();

    const recoveredCount = await AbandonedCheckout.countDocuments({
      recoveredAt: { $ne: null },
    });

    const contactable = items.filter((i) => i.phone || i.email);

    const stats = {
      openCount: items.length,
      openValue: items.reduce((s, i) => s + (i.cartValue || 0), 0),
      contactableCount: contactable.length,
      contactableValue: contactable.reduce(
        (s, i) => s + (i.cartValue || 0),
        0
      ),
      anonymousCount: items.length - contactable.length,
      recoveredCount,
      /* share of carts that went on to become orders */
      recoveryRate:
        items.length + recoveredCount > 0
          ? Math.round(
              (recoveredCount / (items.length + recoveredCount)) * 100
            )
          : 0,
    };

    return NextResponse.json({ success: true, items, stats });
  } catch (error) {
    console.error("abandoned-checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/* ADMIN: remove one record (?id=) */
export async function DELETE(req) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    await connectDB();
    await AbandonedCheckout.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("abandoned-checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
