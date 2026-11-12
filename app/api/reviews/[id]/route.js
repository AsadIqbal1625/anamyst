import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import Review from "../../../../models/Review";
import { isAdminRequest } from "../../../../lib/adminAuth";
import { syncProductRating } from "../../../../lib/reviews";
import { refreshStorePages } from "../../../../lib/refreshStorePages";

const STATUSES = ["pending", "approved", "hidden"];

async function guard(req, params) {

  if (!(await isAdminRequest(req))) {
    return {
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      response: NextResponse.json({ success: false, error: "Review not found" }),
    };
  }

  return { id };

}

/* ADMIN: approve, hide, or send back to pending */
export async function PATCH(req, { params }) {

  const { id, response } = await guard(req, params);
  if (response) return response;

  try {

    const { status } = await req.json();

    if (!STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" });
    }

    await connectDB();

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" });
    }

    await syncProductRating(review.productId);

    refreshStorePages(review.productId);

    return NextResponse.json({ success: true, review });

  } catch (error) {

    console.error("review PATCH error:", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}

/* ADMIN: delete for good (lets the customer write it again) */
export async function DELETE(req, { params }) {

  const { id, response } = await guard(req, params);
  if (response) return response;

  try {

    await connectDB();

    const review = await Review.findByIdAndDelete(id).lean();

    if (review) {
      await syncProductRating(review.productId);
      refreshStorePages(review.productId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("review DELETE error:", error);
    return NextResponse.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}
