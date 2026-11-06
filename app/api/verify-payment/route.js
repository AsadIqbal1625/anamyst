import crypto
from "crypto";

import { safeEqual }
from "../../../lib/safeEqual";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = body;

    const generatedSignature =

      crypto
        .createHmac(

          "sha256",

          process.env
            .RAZORPAY_KEY_SECRET

        )

        .update(

          razorpay_order_id +
          "|" +
          razorpay_payment_id

        )

        .digest("hex");

    const isAuthentic =

      safeEqual(
        generatedSignature,
        razorpay_signature
      );

    return Response.json({

      success:
        isAuthentic,

    });

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

    });

  }

}