import Razorpay from "razorpay";

import { priceCart, PricingError } from "../../../lib/serverPricing";
import { rateLimit } from "../../../lib/rateLimit";
import { validateCheckoutDetails } from "../../../lib/validateCheckout";
import PendingOrder from "../../../models/PendingOrder";

/* CREATE A RAZORPAY ORDER

   The amount is never taken from the request. The browser sends the
   cart (product ids and quantities) and the coupon code; the payable
   amount is rebuilt from the database here, so the customer cannot
   choose what they are charged. */

export async function POST(req) {

  try {

    const limited = await rateLimit(req, "razorpay", 20);
    if (limited) return limited;

    const body = await req.json();

    /* last chance to reject anything: the customer hasn't paid yet */
    const { details, error: detailsError } =
      validateCheckoutDetails(body);

    if (detailsError) throw new PricingError(detailsError);

    const { products, couponCode, totals } = await priceCart({
      items: body.products,
      couponCode: body.couponCode,
      paymentMethod: "RAZORPAY",
    });

    if (totals.total <= 0) {

      return Response.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );

    }

    const razorpay = new Razorpay({

      key_id: process.env.RAZORPAY_KEY_ID,

      key_secret: process.env.RAZORPAY_KEY_SECRET,

    });

    const order = await razorpay.orders.create({

      /* paise, computed server-side */
      amount: Math.round(totals.total * 100),

      currency: "INR",

      receipt: "receipt_" + Date.now(),

    });

    /* snapshot the order before the customer pays, so it can always be
       completed afterwards. If this fails, no money has moved yet. */
    await PendingOrder.create({
      razorpayOrderId: order.id,
      details,
      products,
      couponCode,
      totals: {
        discount: totals.discount,
        discountLabel: totals.discountLabel,
        shippingCost: totals.shippingCost,
        codCharge: totals.codCharge,
        total: totals.total,
      },
      notifyEmail: body.notifyEmail !== false,
      notifyWhatsapp: Boolean(body.notifyWhatsapp),
      sessionId: String(body.sessionId || "").slice(0, 64),
    });

    return Response.json({

      success: true,

      order,

      /* so the checkout can show the authoritative figure */
      amount: totals.total,

    });

  } catch (error) {

    if (error instanceof PricingError) {

      return Response.json(
        { success: false, error: error.message },
        { status: error.status }
      );

    }

    console.error("razorpay order error:", error);

    return Response.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}
