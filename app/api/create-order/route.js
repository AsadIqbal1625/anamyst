import crypto
from "crypto";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const {

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

    } = body;

    /* VALIDATION */
    if (

      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature

    ) {

      return Response.json(

        {

          success: false,

          error:
            "Missing fields",

        },

        {
          status: 400,
        }

      );

    }

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

    /* VERIFY */
    const isAuthentic =

      generatedSignature ===
      razorpay_signature;

    if (
      !isAuthentic
    ) {

      return Response.json(

        {

          success: false,

          error:
            "Signature mismatch",

        },

        {
          status: 400,
        }

      );

    }

    return Response.json({

      success: true,

    });

  } catch (error) {

    console.log(error);

    return Response.json(

      {

        success: false,

        error:
          error.message,

      },

      {
        status: 500,
      }

    );

  }

}