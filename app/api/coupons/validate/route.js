import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";

export async function POST(req) {
  try {
    await connectDB();
    const { code, total } = await req.json();

    if (!code) {
      return NextResponse.json({
        success: false,
        error: "Please enter a coupon code",
      });
    }

    const coupon = await Coupon.findOne({
      code: String(code).toUpperCase().trim(),
    }).lean();

    if (!coupon || !coupon.active) {
      return NextResponse.json({
        success: false,
        error: "Invalid coupon code",
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({
        success: false,
        error: "This coupon has expired",
      });
    }

    const orderTotal = Number(total) || 0;

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        success: false,
        error: `Minimum order of ₹${coupon.minOrder} required`,
      });
    }

    const discount =
      coupon.discountType === "percent"
        ? Math.round((orderTotal * coupon.value) / 100)
        : Math.min(coupon.value, orderTotal);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
      discount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
