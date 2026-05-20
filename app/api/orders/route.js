import { connectDB }
from "../../../lib/mongodb";

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

    return Response.json({
      success: true,
      orders,
    });

  } catch (error) {

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

    const order =
      await Order.create(body);

    return Response.json({
      success: true,
      order,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}