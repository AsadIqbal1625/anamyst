import Razorpay from "razorpay";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const amount =
      body.amount;

    if (!amount) {

      return Response.json({

        success: false,

        message:
          "Amount required",

      });

    }

    const razorpay =
      new Razorpay({

        key_id:
          process.env
            .RAZORPAY_KEY_ID,

        key_secret:
          process.env
            .RAZORPAY_KEY_SECRET,

      });

    const options = {

      amount:
        Number(amount) * 100,

      currency: "INR",

      receipt:
        "receipt_" +
        Date.now(),

    };

    const order =
      await razorpay.orders.create(
        options
      );

    return Response.json({

      success: true,

      order,

    });

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

      error:
        error.message,

    });

  }

}