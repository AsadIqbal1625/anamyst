import { NextResponse }
from "next/server";

import { connectDB }
from "../../../../lib/mongodb";

import Order
from "../../../../models/Order";

import Product
from "../../../../models/Product";

/* restore (+1) or re-deduct (-1) stock for an order's items */
async function adjustStock(order, direction) {
  await Product.bulkWrite(
    (order.products || [])
      .filter((p) => p.productId)
      .map((p) => ({
        updateOne: {
          filter: { _id: p.productId },
          update: { $inc: { stock: direction * p.quantity } },
        },
      }))
  ).catch(() => {});
}

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

    const update = {};

    if (body.orderStatus) {
      update.orderStatus =
        body.orderStatus;

      /* CANCEL ↔ UNCANCEL: keep stock in sync */

      const before =
        await Order.findById(params.id);

      if (before) {

        if (
          body.orderStatus === "Cancelled" &&
          before.orderStatus !== "Cancelled"
        ) {
          await adjustStock(before, +1);
        }

        if (
          body.orderStatus !== "Cancelled" &&
          before.orderStatus === "Cancelled"
        ) {
          await adjustStock(before, -1);
        }

      }

    }

    /* MANUAL PAYMENT STATUS UPDATE */

    if (body.paymentStatus) {
      update.paymentStatus =
        body.paymentStatus;
    }

    /* COD ORDERS: delivered = cash collected = paid */

    if (
      body.orderStatus === "Delivered" &&
      !body.paymentStatus
    ) {

      const existing =
        await Order.findById(params.id);

      if (
        existing &&
        existing.paymentMethod === "COD"
      ) {
        update.paymentStatus = "Paid";
      }

    }

    const updatedOrder =
      await Order.findByIdAndUpdate(

        params.id,

        update,

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