import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Notice from "../../../../models/Notice";
import { isAdminRequest } from "../../../../lib/adminAuth";

const EDITABLE_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "image",
  "published",
];

/* GET SINGLE NOTICE (by id or slug) */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const notice =
      (await Notice.findById(id).catch(() => null)) ||
      (await Notice.findOne({ slug: id }));

    /* a hidden notice looks the same as a missing one to the public */
    if (
      !notice ||
      (!notice.published && !(await isAdminRequest(req)))
    ) {
      return NextResponse.json({
        success: false,
        error: "Notice not found",
      });
    }

    return NextResponse.json({ success: true, notice });
  } catch (error) {

    console.error("[id] error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}

/* UPDATE NOTICE */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const update = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in body) update[field] = body[field];
    }

    const notice = await Notice.findByIdAndUpdate(id, update, {
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

    console.error("[id] error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
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

    console.error("[id] error:", error);

    return NextResponse.json({ success: false, error: "Something went wrong. Please try again.", });
  }
}
