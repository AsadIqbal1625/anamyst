import crypto from "crypto";

import { finalizeRazorpayOrder } from "../../../../lib/placeOrder";

/* RAZORPAY WEBHOOK — Razorpay calls this directly when a payment succeeds,
   so an order is recorded even if the customer's browser closed or failed
   right after paying. Public by design: only the signature, made with
   RAZORPAY_WEBHOOK_SECRET, is trusted. */

const HANDLED = ["payment.captured", "order.paid"];

export async function POST(req) {

  try {

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return Response.json({ success: false }, { status: 503 });
    }

    /* the signature covers the exact raw bytes, so read before parsing */
    const raw = await req.text();

    const expected = Buffer.from(
      crypto.createHmac("sha256", secret).update(raw).digest("hex")
    );

    const received = Buffer.from(
      req.headers.get("x-razorpay-signature") || ""
    );

    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return Response.json({ success: false }, { status: 400 });
    }

    const event = JSON.parse(raw);

    const payment = event.payload?.payment?.entity;

    if (!HANDLED.includes(event.event) || !payment?.order_id) {
      return Response.json({ success: true });
    }

    const { order } = await finalizeRazorpayOrder({
      razorpayOrderId: payment.order_id,
      paymentId: payment.id,
      paidPaise: Number(payment.amount) || 0,
    });

    if (!order) {
      /* not a checkout order — retrying would not change the answer */
      console.error("webhook payment has no snapshot", {
        razorpayOrderId: payment.order_id,
        paymentId: payment.id,
      });
    }

    return Response.json({ success: true });

  } catch (error) {

    /* a non-2xx makes Razorpay retry, and retries are safe here */
    console.error("razorpay webhook error:", error);

    return Response.json({ success: false }, { status: 500 });

  }

}
