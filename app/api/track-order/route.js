import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";

/* PUBLIC: customers track their own orders by Order ID, phone or email.
   Requires an exact match — never exposes the full order list. */
export async function POST(req) {
  try {
    const { query } = await req.json();

    const q = String(query || "").trim();

    if (q.length < 5) {
      return NextResponse.json({
        success: false,
        error: "Enter your full Order ID, phone number or email",
      });
    }

    await connectDB();

    /* escape regex characters so nobody can search with wildcards */
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const orders = await Order.find({
      $or: [
        { orderId: new RegExp(`^${escaped}$`, "i") },
        { phone: q },
        { email: new RegExp(`^${escaped}$`, "i") },
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
    return NextResponse.json({ success: false, error: error.message });
  }
}
