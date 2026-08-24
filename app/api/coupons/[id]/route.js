import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Coupon from "../../../../models/Coupon";

const EDITABLE_FIELDS = [
  "code",
  "discountType",
  "value",
  "minOrder",
  "expiresAt",
  "active",
];

/* UPDATE COUPON (toggle active, edit fields) */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const update = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in body) update[field] = body[field];
    }

    const coupon = await Coupon.findByIdAndUpdate(id, update, {
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

    console.error("[id] error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
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

    console.error("[id] error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}
