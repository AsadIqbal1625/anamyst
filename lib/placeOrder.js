import { connectDB } from "./mongodb";
import {
  generateCustomerId,
  generateOrderId,
  generateInvoiceId,
} from "./generateIds";
import { sendOrderEmail } from "./sendOrderEmail";
import { sendOwnerOrderAlert } from "./sendOwnerOrderAlert";
import { sendWhatsAppOrderConfirmation } from "./sendWhatsAppMessage";
import Order from "../models/Order";
import Product from "../models/Product";
import Coupon from "../models/Coupon";
import Customer from "../models/Customer";
import PendingOrder from "../models/PendingOrder";
import AbandonedCheckout from "../models/AbandonedCheckout";

async function findOrCreateCustomer(details) {

  const existing = await Customer.findOne({ mobile: details.phone });

  if (existing) return existing;

  try {

    return await Customer.create({
      customerId: await generateCustomerId(),
      name: details.customerName,
      mobile: details.phone,
      email: details.email,
      city: details.city,
      state: details.state,
      address: details.address,
      totalOrders: 0,
      totalSpent: 0,
    });

  } catch (error) {

    /* two requests for the same new number: the other one won */
    if (error?.code === 11000) {
      const winner = await Customer.findOne({ mobile: details.phone });
      if (winner) return winner;
    }

    throw error;

  }

}

/* Everything after the order exists. A failure here is logged, never
   thrown: the customer's order is already safe at this point. */
async function afterOrderCreated({
  order,
  customer,
  details,
  products,
  couponCode,
  sessionId,
  reviewNotes,
}) {

  const notes = [...reviewNotes];

  try {

    await Customer.updateOne(
      { _id: customer._id },
      {
        $inc: { totalOrders: 1, totalSpent: order.totalAmount },
        $set: { lastOrderDate: new Date() },
      }
    );

    /* take stock only if it is really there, so it can't go negative
       and an oversold item gets flagged instead of hidden */
    for (const p of products) {

      const result = await Product.updateOne(
        { _id: p.productId, stock: { $gte: p.quantity } },
        { $inc: { stock: -p.quantity } }
      );

      if (result.modifiedCount === 0) {
        notes.push(
          `"${p.name}" (qty ${p.quantity}) was out of stock when this order completed`
        );
      }

    }

    if (notes.length > 0) {
      order.needsReview = true;
      order.reviewNote = notes.join(". ");
      await order.save();
    }

    if (couponCode) {
      await Coupon.updateOne(
        { code: couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    /* the cart became an order; kept (not deleted) to measure recovery */
    const match = [
      { phone: details.phone.replace(/\D/g, "").slice(0, 12) },
      { email: details.email },
    ];

    if (sessionId) {
      match.push({ sessionId: String(sessionId).trim().slice(0, 64) });
    }

    await AbandonedCheckout.updateMany(
      { $or: match, recoveredAt: null },
      { $set: { recoveredAt: new Date() } }
    );

  } catch (error) {

    console.error("post-order bookkeeping failed:", order.orderId, error);

  }

  /* each sender catches its own errors */
  if (order.notifyEmail !== false) {

    /* keep the outcome on the order, so admin shows when a customer
       did not get their confirmation, and why */
    const result = await sendOrderEmail(order);

    try {

      await Order.updateOne(
        { _id: order._id },
        {
          emailStatus: result.ok ? "sent" : "failed",
          emailError: result.ok ? "" : result.error.slice(0, 300),
        }
      );

    } catch (error) {

      console.error("could not save email status:", order.orderId, error);

    }

  }
  if (order.notifyWhatsapp) await sendWhatsAppOrderConfirmation(order);
  await sendOwnerOrderAlert(order);

}

/* The one place an order is created, for COD and Razorpay alike. The
   unique index on paymentId means a payment can back only one order, so
   when the browser and the webhook race, only the winner sends emails or
   touches stock. */
export async function placeOrder({
  details,
  products,
  totals,
  couponCode = "",
  paymentMethod,
  paymentStatus,
  paymentId,
  razorpayOrderId,
  notifyEmail = true,
  notifyWhatsapp = false,
  sessionId = "",
  reviewNotes = [],
}) {

  await connectDB();

  const customer = await findOrCreateCustomer(details);

  let order;

  try {

    order = await Order.create({
      ...details,

      products,
      couponCode,
      discount: totals.discount,
      discountLabel: totals.discountLabel,
      shippingCost: totals.shippingCost,
      codFee: totals.codCharge,
      totalAmount: totals.total,

      paymentMethod,
      paymentStatus,
      orderStatus: "Pending",
      paymentId,
      razorpayOrderId,

      notifyEmail,
      notifyWhatsapp,

      customerId: customer.customerId,
      orderId: await generateOrderId(),
      invoiceId: await generateInvoiceId(),
    });

  } catch (error) {

    const duplicate = error?.keyValue?.paymentId;

    if (error?.code === 11000 && duplicate) {

      const existing = await Order.findOne({ paymentId: duplicate });

      if (existing) return { order: existing, created: false };

    }

    throw error;

  }

  await afterOrderCreated({
    order,
    customer,
    details,
    products,
    couponCode,
    sessionId,
    reviewNotes,
  });

  return { order, created: true };

}

/* Turn a genuine Razorpay payment into an order. Called by the browser
   after checkout and by the webhook; whichever arrives first creates it.
   The caller must already have verified the payment is authentic.

   The customer has paid, so problems are flagged for review rather than
   refused — an order to refund beats money with no record. */
export async function finalizeRazorpayOrder({
  razorpayOrderId,
  paymentId,
  paidPaise,
}) {

  await connectDB();

  const existing = await Order.findOne({ paymentId });

  if (existing) return { order: existing, created: false };

  const pending =
    await PendingOrder.findOne({ razorpayOrderId }).lean();

  if (!pending) return { order: null, created: false };

  const reviewNotes = [];

  const duePaise = Math.round(pending.totals.total * 100);

  if (paidPaise < duePaise) {
    reviewNotes.push(
      `Paid ₹${paidPaise / 100} but the order total is ₹${pending.totals.total}`
    );
  }

  return placeOrder({
    details: pending.details,
    products: pending.products,
    totals: pending.totals,
    couponCode: pending.couponCode,
    paymentMethod: "RAZORPAY",
    paymentStatus: "Paid",
    paymentId,
    razorpayOrderId,
    notifyEmail: pending.notifyEmail,
    notifyWhatsapp: pending.notifyWhatsapp,
    sessionId: pending.sessionId,
    reviewNotes,
  });

}
