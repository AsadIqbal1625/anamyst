import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Coupon from "../../../models/Coupon";

/* LIST COUPONS */
export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* CREATE COUPON */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.code || !body.value) {
      return NextResponse.json({
        success: false,
        error: "Code and value are required",
      });
    }

    const coupon = await Coupon.create({
      code: body.code,
      discountType: body.discountType || "percent",
      value: Number(body.value),
      minOrder: Number(body.minOrder) || 0,
      expiresAt: body.expiresAt || null,
      active: true,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    const message =
      error.code === 11000
        ? "Coupon code already exists"
        : error.message;
    return NextResponse.json({ success: false, error: message });
  }
}
