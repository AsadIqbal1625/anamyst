import crypto from "crypto";

import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import Razorpay from "razorpay";
import { priceCart, PricingError } from "../../../lib/serverPricing";
import { rateLimit } from "../../../lib/rateLimit";
import { validateCheckoutDetails } from "../../../lib/validateCheckout";
import {
  placeOrder,
  finalizeRazorpayOrder,
} from "../../../lib/placeOrder";
import { safeEqual } from "../../../lib/safeEqual";

/* GET ORDERS */
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
}

/* COD: priced and validated here, nothing has been paid yet */
async function placeCodOrder(req, body) {

  /* spam guard — this path costs nothing to abuse and sends emails */
  const limited = await rateLimit(req, "orders", 8);
  if (limited) return limited;

  const { details, error } = validateCheckoutDetails(body);

  if (error) throw new PricingError(error);

  const { products, couponCode, totals } = await priceCart({
    items: body.products,
    couponCode: body.couponCode,
    paymentMethod: "COD",
    phone: details.phone,
  });

  const { order } = await placeOrder({
    details,
    products,
    totals,
    couponCode,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    notifyEmail: body.notifyEmail !== false,
    notifyWhatsapp: Boolean(body.notifyWhatsapp),
    sessionId: body.sessionId,
  });

  return Response.json({ success: true, order });

}

/* RAZORPAY: the customer has already paid. The order comes from the
   snapshot saved before payment, never from this request, so nothing
   here is rate limited or rejected for a detail that changed since. A
   fake request still dies at the signature check. */
async function confirmRazorpayOrder(body) {

  const razorpayOrderId = String(body.razorpayOrderId ?? "");
  const paymentId = String(body.paymentId ?? "");

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + "|" + paymentId)
    .digest("hex");

  if (
    !razorpayOrderId ||
    !paymentId ||
    !safeEqual(expected, body.razorpaySignature)
  ) {
    return Response.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 }
    );
  }

  /* confirm with Razorpay what actually happened */

  let payment;

  try {

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    payment = await razorpay.payments.fetch(paymentId);

  } catch (err) {

    console.error("razorpay payment fetch failed:", err);

    return Response.json(
      {
        success: false,
        error:
          "Your payment is safe. We are confirming your order and will email you shortly.",
      },
      { status: 502 }
    );

  }

  if (!["captured", "authorized"].includes(payment?.status)) {

    console.error("payment not completed", {
      paymentId,
      status: payment?.status,
    });

    return Response.json(
      { success: false, error: "Payment verification failed" },
      { status: 400 }
    );

  }

  const { order } = await finalizeRazorpayOrder({
    razorpayOrderId,
    paymentId,
    paidPaise: Number(payment.amount) || 0,
  });

  if (!order) {

    console.error("paid order has no snapshot", {
      razorpayOrderId,
      paymentId,
    });

    return Response.json(
      {
        success: false,
        error:
          "Your payment is safe, but we could not finish your order. Please contact us with your payment details.",
      },
      { status: 500 }
    );

  }

  return Response.json({ success: true, order });

}

/* CREATE ORDER */
export async function POST(req) {

  try {

    const body = await req.json();

    return body.paymentMethod === "RAZORPAY"
      ? await confirmRazorpayOrder(body)
      : await placeCodOrder(req, body);

  } catch (error) {

    /* problems the customer can fix (empty cart, out of stock, bad
       details) keep their message; anything else stays generic */
    if (error instanceof PricingError) {

      return Response.json(
        { success: false, error: error.message },
        { status: error.status }
      );

    }

    console.error("order error:", error);

    return Response.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}
