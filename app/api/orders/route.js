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
import Setting from "../../../models/Setting";
import { getPricingBenefits } from "../../../lib/pricing";

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

    /* ── SERVER-SIDE PRICING ──
       Never trust prices/totals from the browser: rebuild every
       line item from the DB and recompute the payable amount. */

    const cartItems = Array.isArray(body.products)
      ? body.products
      : [];

    if (cartItems.length === 0) {
      return Response.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    const ids = cartItems.map((i) => i.productId).filter(Boolean);

    const dbProducts = await Product.find({
      _id: { $in: ids },
    }).lean();

    const productMap = Object.fromEntries(
      dbProducts.map((p) => [String(p._id), p])
    );

    let subtotal = 0;

    const products = [];

    for (const item of cartItems) {

      const db = productMap[String(item.productId)];

      const quantity = Math.max(
        1,
        Math.floor(Number(item.quantity) || 1)
      );

      if (!db) {
        return Response.json(
          { success: false, error: "A product in your cart no longer exists. Please refresh your cart." },
          { status: 400 }
        );
      }

      if (typeof db.stock === "number" && db.stock < quantity) {
        return Response.json(
          {
            success: false,
            error: `"${db.name}" has only ${db.stock} left in stock. Please update your cart.`,
          },
          { status: 400 }
        );
      }

      subtotal += db.price * quantity;

      products.push({
        productId: String(db._id),
        name: db.name,
        image: db.image,
        quantity,
        price: db.price,
      });

    }

    /* ── SERVER-SIDE COUPON ── */

    let discount = 0;
    let couponCode = "";
    let discountLabel = "";

    if (body.couponCode) {

      const coupon = await Coupon.findOne({
        code: String(body.couponCode).toUpperCase().trim(),
      }).lean();

      const valid =
        coupon &&
        coupon.active &&
        (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date()) &&
        (!coupon.minOrder || subtotal >= coupon.minOrder);

      if (valid) {
        couponCode = coupon.code;
        discount =
          coupon.discountType === "percent"
            ? Math.round((subtotal * coupon.value) / 100)
            : Math.min(coupon.value, subtotal);
        discountLabel = coupon.code;
      }

    }

    /* ── SERVER-SIDE AUTO TIER DISCOUNT + SHIPPING ──
       Skipped when a coupon was applied (no stacking). */

    const storeSettings = await Setting.findOne({ key: "store" }).lean();

    const benefits = getPricingBenefits(
      subtotal,
      storeSettings?.discountTiers
    );

    if (!couponCode && benefits.discountPercent > 0) {
      discount = Math.round((subtotal * benefits.discountPercent) / 100);
      discountLabel = `${benefits.discountPercent}% OFF`;
    }

    const shippingCost = benefits.freeShipping
      ? 0
      : Number(storeSettings?.shippingFee) || 0;

    const totalAmount = Math.max(subtotal - discount, 0) + shippingCost;

    /* ── SERVER-SIDE PAYMENT VERIFICATION ──
       "Paid" is only accepted with a valid Razorpay signature. */

    let paymentMethod = "COD";
    let paymentStatus = "Pending";

    if (body.paymentMethod === "RAZORPAY") {

      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.razorpayOrderId + "|" + body.paymentId)
        .digest("hex");

      if (
        !body.razorpayOrderId ||
        !body.paymentId ||
        expected !== body.razorpaySignature
      ) {
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

    /* ORDER PLACED → no longer an abandoned checkout */

    await AbandonedCheckout.deleteMany({
      $or: [
        { phone: String(body.phone || "").replace(/\D/g, "").slice(0, 12) },
        { email: String(body.email || "").trim().toLowerCase() },
      ],
    }).catch(() => {});

    return Response.json({

      success: true,

      order,

    });

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}