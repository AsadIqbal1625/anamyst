import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";

/* PUBLIC: best active coupon for the storefront promo bar */
export async function GET() {
  try {
    await connectDB();

    const coupons = await Coupon.find({
      active: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
    })
      .sort({ value: -1 })
      .limit(1)
      .lean();

    if (!coupons.length) {
      return NextResponse.json({ success: true, coupon: null });
    }

    const c = coupons[0];

    return NextResponse.json({
      success: true,
      coupon: {
        code: c.code,
        discountType: c.discountType,
        value: c.value,
        minOrder: c.minOrder || 0,
        expiresAt: c.expiresAt || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, coupon: null });
  }
}
