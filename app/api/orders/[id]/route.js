import { connectDB }
from "../../../../lib/mongodb";

import Order
from "../../../../models/Order";

import mongoose
from "mongoose";

/* UPDATE ORDER STATUS */
export async function PATCH(
  req,
  context
) {

  try {

    await connectDB();

    const params =
      await context.params;

    const id = params.id;

    if (
      !mongoose.Types.ObjectId
        .isValid(id)
    ) {

      return Response.json({
        success: false,
        error: "Invalid Order ID",
      });

    }

    const body =
      await req.json();

    const updatedOrder =
      await Order.findByIdAndUpdate(

        id,

        {
          orderStatus:
            body.orderStatus,
        },

        {
          new: true,
        }

      );

    return Response.json({

      success: true,

      order:
        updatedOrder,

    });

  } catch (error) {

    return Response.json({

      success: false,

      error:
        error.message,

    });

  }

}