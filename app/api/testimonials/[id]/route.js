import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Testimonial from "../../../../models/Testimonial";

/* UPDATE TESTIMONIAL */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const testimonial = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!testimonial) {
      return NextResponse.json({
        success: false,
        error: "Testimonial not found",
      });
    }

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* DELETE TESTIMONIAL */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
