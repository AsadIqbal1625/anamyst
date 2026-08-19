import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import AbandonedCheckout from "../../../models/AbandonedCheckout";

/* PUBLIC: checkout page pings this (debounced) once the visitor has
   typed a contact — upserts one record per phone/email. */
export async function POST(req) {
  try {
    const body = await req.json();

    const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 12);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 100);

    const validPhone = phone.length >= 10;
    const validEmail = /^\S+@\S+\.\S+$/.test(email);

    const cart = Array.isArray(body.cart) ? body.cart.slice(0, 30) : [];

    if ((!validPhone && !validEmail) || cart.length === 0) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const safeCart = cart.map((i) => ({
      productId: String(i.productId || i._id || ""),
      name: String(i.name || "").slice(0, 120),
      image: String(i.image || ""),
      price: Number(i.price) || 0,
      quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
    }));

    const cartValue = safeCart.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );

    await connectDB();

    await AbandonedCheckout.findOneAndUpdate(
      validPhone ? { phone } : { email },
      {
        phone: validPhone ? phone : "",
        email: validEmail ? email : "",
        name: String(body.name || "").slice(0, 80),
        cart: safeCart,
        cartValue,
        lastActiveAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("abandoned-checkout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

/* ADMIN (gated by proxy.js): list abandoned checkouts */
export async function GET() {
  try {
    await connectDB();

    const items = await AbandonedCheckout.find()
      .sort({ lastActiveAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({ success: true, items });
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
