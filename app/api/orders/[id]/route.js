import { NextResponse }
from "next/server";

import { connectDB }
from "../../../../lib/mongodb";

import Order
from "../../../../models/Order";

/* UPDATE ORDER STATUS */
export async function PATCH(
  request,
  context
) {

  try {

    await connectDB();

    /* NEXTJS PARAMS FIX */
    const params =
      await context.params;

    const body =
      await request.json();

    const updatedOrder =
      await Order.findByIdAndUpdate(

        params.id,

        {
          orderStatus:
            body.orderStatus,
        },

        {
          returnDocument:
            "after",
        }

      );

    return NextResponse.json({

      success: true,

      updatedOrder,

    });

  } catch (error) {

    return NextResponse.json({

      success: false,

      error: error.message,

    });

  }

}