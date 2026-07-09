import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Notice from "../../../../models/Notice";

/* GET SINGLE NOTICE (by id or slug) */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const notice =
      (await Notice.findById(id).catch(() => null)) ||
      (await Notice.findOne({ slug: id }));

    if (!notice) {
      return NextResponse.json({
        success: false,
        error: "Notice not found",
      });
    }

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* UPDATE NOTICE */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const notice = await Notice.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!notice) {
      return NextResponse.json({
        success: false,
        error: "Notice not found",
      });
    }

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/* DELETE NOTICE */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
