import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";

/* UPDATE COUPON (toggle active, edit fields) */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const coupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!coupon) {
      return NextResponse.json({
        success: false,
        error: "Coupon not found",
      });
    }

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* DELETE COUPON */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
