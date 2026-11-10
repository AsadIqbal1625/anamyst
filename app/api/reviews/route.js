import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Review from "../../../models/Review";
import { rateLimit } from "../../../lib/rateLimit";
import { isAdminRequest } from "../../../lib/adminAuth";

const OWN_IMAGES = "https://res.cloudinary.com/dtmunbdlt/";

const lastTenDigits = (value) =>
  String(value || "").replace(/\D/g, "").slice(-10);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const fail = (error) => NextResponse.json({ success: false, error });

/* Only a real buyer can review: the Order ID and the phone number on
   that order must both match, and the order must be delivered. */
async function findDeliveredOrder(orderId, phone) {

  const id = String(orderId || "").trim();
  const digits = lastTenDigits(phone);

  if (id.length < 5 || digits.length < 10) {
    return {
      error: "Enter your Order ID and the phone number used on the order",
    };
  }

  const order = await Order.findOne({
    orderId: new RegExp(`^${escapeRegex(id)}$`, "i"),
  }).lean();

  if (!order || lastTenDigits(order.phone) !== digits) {
    return {
      error: "We couldn't find an order with that Order ID and phone number",
    };
  }

  if (order.orderStatus !== "Delivered") {
    return {
      error: "You can review your order once it has been delivered",
    };
  }

  return { order };

}

/* The order's products that still exist in the shop, each listed once */
async function reviewableItems(order) {

  const seen = new Set();

  const items = (order.products || []).filter((p) => {
    const id = String(p.productId || "");
    if (!mongoose.Types.ObjectId.isValid(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  const existing = await Product.find(
    { _id: { $in: items.map((p) => p.productId) } },
    "_id"
  ).lean();

  const live = new Set(existing.map((p) => String(p._id)));

  return items.filter((p) => live.has(String(p.productId)));

}

/* PUBLIC: look up an order's products, or submit one review.
   body.action is "lookup" or "submit". */
export async function POST(req) {

  try {

    const limited = await rateLimit(req, "reviews", 15);
    if (limited) return limited;

    const body = await req.json();

    await connectDB();

    const { order, error } = await findDeliveredOrder(body.orderId, body.phone);
    if (error) return fail(error);

    const items = await reviewableItems(order);

    const alreadyReviewed = new Set(
      (await Review.find({ order: order._id }, "productId").lean()).map(
        (r) => r.productId
      )
    );

    const firstName =
      String(order.customerName || "").trim().split(/\s+/)[0].slice(0, 40);

    if (body.action === "lookup") {

      return NextResponse.json({
        success: true,
        name: firstName,
        products: items.map((p) => ({
          productId: String(p.productId),
          name: p.name,
          image: String(p.image || "").startsWith(OWN_IMAGES) ? p.image : "",
          reviewed: alreadyReviewed.has(String(p.productId)),
        })),
      });

    }

    /* SUBMIT */

    const productId = String(body.productId || "");
    const item = items.find((p) => String(p.productId) === productId);

    if (!item) return fail("That product isn't part of this order");

    if (alreadyReviewed.has(productId)) {
      return fail("You've already reviewed this product. Thank you!");
    }

    const rating = Number(body.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return fail("Please choose a star rating");
    }

    const text = String(body.text || "").trim();

    if (text.length < 10) {
      return fail("Please write a few words about the fragrance (at least 10 characters)");
    }

    if (text.length > 1000) {
      return fail("Please keep your review under 1000 characters");
    }

    const name =
      String(body.name || "").trim().slice(0, 40) || firstName || "Customer";

    try {

      await Review.create({
        productId,
        productName: item.name,
        order: order._id,
        orderId: order.orderId,
        name,
        rating,
        text,
      });

    } catch (err) {

      /* two quick submits of the same review */
      if (err?.code === 11000) {
        return fail("You've already reviewed this product. Thank you!");
      }

      throw err;

    }

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("reviews POST error:", error);
    return fail("Something went wrong. Please try again.");

  }

}

/* ADMIN: every review, newest first */
export async function GET(req) {

  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {

    await connectDB();

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({ success: true, reviews });

  } catch (error) {

    console.error("reviews GET error:", error);
    return fail("Something went wrong. Please try again.");

  }

}
