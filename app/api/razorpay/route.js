import Razorpay from "razorpay";

import { priceCart, PricingError } from "../../../lib/serverPricing";
import { rateLimit } from "../../../lib/rateLimit";

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

    const { totals } = await priceCart({
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
