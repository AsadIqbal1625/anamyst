import Razorpay from "razorpay";

export async function POST() {

  try {

    console.log(
      "KEY:",
      process.env.RAZORPAY_KEY_ID
    );

    console.log(
      "SECRET:",
      process.env.RAZORPAY_KEY_SECRET
    );

    const razorpay =
      new Razorpay({

        key_id:
          process.env.RAZORPAY_KEY_ID,

        key_secret:
          process.env.RAZORPAY_KEY_SECRET,

      });

    const order =
      await razorpay.orders.create({

        amount: 50000,

        currency: "INR",

        receipt:
          "test_receipt",

      });

    return Response.json({

      success: true,

      order,

    });

  } catch (error) {

    console.log(
      "RAZORPAY ERROR:",
      error
    );

    return Response.json({

      success: false,

      error:
        error.message,

    });

  }

}