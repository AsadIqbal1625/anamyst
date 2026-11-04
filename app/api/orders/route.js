import crypto from "crypto";

import Customer from "../../../models/Customer";

import {
  generateCustomerId,
  generateOrderId,
  generateInvoiceId,
} from "../../../lib/generateIds";
import { connectDB } from "../../../lib/mongodb";
import { sendOrderEmail } from "../../../lib/sendOrderEmail";
import { sendOwnerOrderAlert } from "../../../lib/sendOwnerOrderAlert";
import AbandonedCheckout from "../../../models/AbandonedCheckout";
import { sendWhatsAppOrderConfirmation } from "../../../lib/sendWhatsAppMessage";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import Coupon from "../../../models/Coupon";
import Razorpay from "razorpay";
import { priceCart, PricingError } from "../../../lib/serverPricing";
import { rateLimit } from "../../../lib/rateLimit";
import { validateCheckoutDetails } from "../../../lib/validateCheckout";

/* constant-time string compare (signature checks) */
function safeEqual(a, b) {
  const x = Buffer.from(String(a ?? ""));
  const y = Buffer.from(String(b ?? ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

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

/* CREATE ORDER */

export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    const requestedMethod =
      body.paymentMethod === "RAZORPAY" ? "RAZORPAY" : "COD";

    /* ── INPUT VALIDATION ──
       Every field is forced to a plain, length-capped string. This stops
       operator objects like {"$ne":null} reaching a Mongo query (they
       would match someone else's customer record) and keeps hostile HTML
       out of orders, emails and the admin invoice. */

    const { details, error: detailsError } =
      validateCheckoutDetails(body);

    Object.assign(body, details);

    if (requestedMethod === "COD") {

      /* Spam guard for the path that costs nothing to abuse. Razorpay
         orders are deliberately exempt, as are their detail errors below:
         that money is already taken, so a customer who has really paid
         must never be turned away here. A fake RAZORPAY request still
         dies at the signature check. */
      const limited = await rateLimit(req, "orders", 8);
      if (limited) return limited;

      if (detailsError) throw new PricingError(detailsError);

      /* nothing about a Razorpay payment may ride along on a COD order */
      delete body.paymentId;
      delete body.razorpayOrderId;

    } else {

      body.paymentId = String(body.paymentId ?? "");
      body.razorpayOrderId = String(body.razorpayOrderId ?? "");

    }

    /* ── SERVER-SIDE PRICING ──
       Never trust prices/totals from the browser: every line item and
       the payable amount are rebuilt from the DB. This is the same
       call the Razorpay order used, so the amount collected and the
       amount recorded cannot disagree. */

    const priced = await priceCart({
      items: body.products,
      couponCode: body.couponCode,
      paymentMethod: requestedMethod,
    });

    const { products, couponCode, totals } = priced;

    const discount = totals.discount;
    const discountLabel = totals.discountLabel;
    const shippingCost = totals.shippingCost;
    const codFee = totals.codCharge;
    const totalAmount = totals.total;

    /* ── SERVER-SIDE PAYMENT VERIFICATION ──
       "Paid" needs both a valid signature (the payment is genuine and
       untampered) and a captured amount that covers the price we just
       computed — a signature alone says nothing about how much was
       actually paid. */

    let paymentMethod = "COD";
    let paymentStatus = "Pending";

    if (requestedMethod === "RAZORPAY") {

      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.razorpayOrderId + "|" + body.paymentId)
        .digest("hex");

      if (
        !body.razorpayOrderId ||
        !body.paymentId ||
        !safeEqual(expected, body.razorpaySignature)
      ) {
        return Response.json(
          { success: false, error: "Payment verification failed" },
          { status: 400 }
        );
      }

      /* REPLAY GUARD — a payment pays for exactly one order. Without
         this, one valid payment could be re-posted any number of times
         to mint free paid orders. Re-submitting (double click, retry)
         just returns the order that already exists. */
      const already = await Order.findOne({ paymentId: body.paymentId });

      if (already) {
        return Response.json({ success: true, order: already });
      }

      /* confirm with Razorpay what was actually captured */

      let payment;

      try {

        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        payment = await razorpay.payments.fetch(body.paymentId);

      } catch (err) {

        console.error("razorpay payment fetch failed:", err);

        return Response.json(
          {
            success: false,
            error:
              "We could not confirm your payment. If money was debited, contact support and we will sort it out.",
          },
          { status: 502 }
        );

      }

      const paidPaise = Number(payment?.amount) || 0;
      const duePaise = Math.round(totalAmount * 100);

      /* underpayment is refused outright; an overpayment (a price that
         dropped mid-checkout) still creates the order so the customer
         is not left having paid for nothing */
      if (
        paidPaise < duePaise ||
        !["captured", "authorized"].includes(payment?.status)
      ) {

        console.error("payment amount mismatch", {
          paymentId: body.paymentId,
          paidPaise,
          duePaise,
          status: payment?.status,
        });

        return Response.json(
          { success: false, error: "Payment verification failed" },
          { status: 400 }
        );

      }

      paymentMethod = "RAZORPAY";
      paymentStatus = "Paid";

    }

    let customer =
      await Customer.findOne({
        mobile: body.phone,
      });

    /* NEW CUSTOMER */

          if (!customer) {
         
          customer = await Customer.create({

        customerId: await generateCustomerId(),

        name: body.customerName,

        mobile: body.phone,

        email: body.email,

        city: body.city,

        state: body.state,

        address: body.address,

        totalOrders: 1,

        totalSpent: totalAmount,

        lastOrderDate: new Date(),

      });

        ;

    }

    /* EXISTING CUSTOMER */

    else {

      customer.totalOrders += 1;

      customer.totalSpent +=
        totalAmount;

      customer.lastOrderDate =
        new Date();

      await customer.save();

    }

    /* CREATE ORDER */
            
        const order = await Order.create({

        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,

        products,
        totalAmount,
        couponCode,
        discount,
        discountLabel,
        shippingCost,
        codFee,

        paymentMethod,
        paymentStatus,
        orderStatus: "Pending",

        paymentId: body.paymentId,
        razorpayOrderId: body.razorpayOrderId,

        notifyEmail: body.notifyEmail !== false,
        notifyWhatsapp: Boolean(body.notifyWhatsapp),

        customerId: customer.customerId,

        orderId: await generateOrderId(),

        invoiceId: await generateInvoiceId(),

      });

    /* DECREMENT STOCK (floor at 0 via the availability check above) */

    await Product.bulkWrite(
      products.map((p) => ({
        updateOne: {
          filter: { _id: p.productId },
          update: { $inc: { stock: -p.quantity } },
        },
      }))
    ).catch(() => {});

    /* COUNT COUPON USAGE */

    if (couponCode) {

      await Coupon.updateOne(
        { code: couponCode },
        { $inc: { usedCount: 1 } }
      ).catch(() => {});

    }

    /* NOTIFY CUSTOMER (per their checkout preference) */

    if (order.notifyEmail !== false) {
      await sendOrderEmail(order);
    }

    if (order.notifyWhatsapp) {
      await sendWhatsAppOrderConfirmation(order);
    }

    /* ALWAYS alert the store owner */

    await sendOwnerOrderAlert(order);

    /* ORDER PLACED → mark the cart recovered rather than deleting it,
       so recovery rate stays measurable. The TTL still cleans up. */

    const recoveryMatch = [
      { phone: String(body.phone || "").replace(/\D/g, "").slice(0, 12) },
      { email: String(body.email || "").trim().toLowerCase() },
    ];

    if (body.sessionId) {
      recoveryMatch.push({
        sessionId: String(body.sessionId).trim().slice(0, 64),
      });
    }

    await AbandonedCheckout.updateMany(
      { $or: recoveryMatch, recoveredAt: null },
      { $set: { recoveredAt: new Date() } }
    ).catch(() => {});

    return Response.json({

      success: true,

      order,

    });

  } catch (error) {

    /* two simultaneous submits of the same payment: the unique index on
       paymentId rejected the second — hand back the first order */
    const dupPayment = error?.keyValue?.paymentId;

    if (error?.code === 11000 && dupPayment) {

      const existing = await Order.findOne({ paymentId: dupPayment });

      if (existing) {
        return Response.json({ success: true, order: existing });
      }

    }

    /* cart problems the customer can fix (empty cart, out of stock)
       keep their specific message; anything else stays generic */
    if (error instanceof PricingError) {

      return Response.json(
        { success: false, error: error.message },
        { status: error.status }
      );

    }

    console.log(error);

    return Response.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}