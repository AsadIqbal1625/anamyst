import { connectDB }
from "../../../lib/mongodb";
import {
  sendOrderEmail,
} from "../../../lib/sendOrderEmail";
import Order
from "../../../models/Order";

/* GET ORDERS */
export async function GET() {

  try {

    await connectDB();

    const orders =
      await Order.find()
        .sort({
          createdAt: -1,
        });
        await sendOrderEmail(order);

    return Response.json({

      success: true,

      orders,

    });
    

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

      error: error.message,

    });

  }

}

/* CREATE ORDER */
export async function POST(req) {

  try {

    await connectDB();

    const body =
      await req.json();

    /* ORDER ID */
    const orderId =

      "ANM-" +

      Math.floor(
        100000 +
        Math.random() *
        900000
      );

    /* CREATE */
    const order =
      await Order.create({

        ...body,

        orderId,

      });

    await sendOrderEmail(order);

        return Response.json({

          success: true,

          order,

        });

  } catch (error) {

    console.log(error);

    return Response.json({

      success: false,

      error: error.message,

    });

  }

}