import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";

/* PUBLIC: customers track their own orders. Requires the Order ID
   AND the matching phone/email on that order — knowing someone's
   phone number alone must not reveal their order history. */
export async function POST(req) {
  try {
    const { orderId, contact } = await req.json();

    const id = String(orderId || "").trim();
    const who = String(contact || "").trim();

    if (id.length < 5 || who.length < 5) {
      return NextResponse.json({
        success: false,
        error: "Enter your Order ID and the phone or email used on the order",
      });
    }

    await connectDB();

    /* escape regex characters so nobody can search with wildcards */
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const orders = await Order.find({
      orderId: new RegExp(`^${esc(id)}$`, "i"),
      $or: [
        { phone: who },
        { email: new RegExp(`^${esc(who)}$`, "i") },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    /* only safe fields — no addresses of other people possible
       since matching requires the customer's own identifiers */
    const safe = orders.map((o) => ({
      orderId: o.orderId,
      orderStatus: o.orderStatus,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      customerName: o.customerName,
      products: (o.products || []).map((p) => ({
        name: p.name,
        quantity: p.quantity,
        image: p.image,
      })),
    }));

    return NextResponse.json({ success: true, orders: safe });
  } catch (error) {

    console.error("track-order error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}
