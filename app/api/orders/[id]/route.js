import { NextResponse }
from "next/server";

import { connectDB }
from "../../../../lib/mongodb";

import Order
from "../../../../models/Order";

import Product
from "../../../../models/Product";

import Customer
from "../../../../models/Customer";

/* customer/shipping fields an admin may correct after the order */
const EDITABLE_FIELDS = [
  "customerName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
];

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

    /* EDIT CUSTOMER / SHIPPING DETAILS */

    for (const field of EDITABLE_FIELDS) {
      if (typeof body[field] === "string") {
        update[field] = body[field].trim();
      }
    }

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

    console.error("[id] error:", error);


    return NextResponse.json({

      success: false,

      error: "Something went wrong. Please try again.",

    });

  }

}

/* DELETE ORDER (e.g. removing test orders)
   Restores stock and rolls back the customer's lifetime totals. */
export async function DELETE(request, context) {

  try {

    await connectDB();

    const params = await context.params;

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    /* cancelled orders already had their stock returned */
    if (order.orderStatus !== "Cancelled") {
      await adjustStock(order, +1);
    }

    if (order.customerId) {
      await Customer.updateOne(
        { customerId: order.customerId },
        {
          $inc: {
            totalOrders: -1,
            totalSpent: -(order.totalAmount || 0),
          },
        }
      ).catch(() => {});
    }

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("[id] delete error:", error);

    return NextResponse.json({
      success: false,
      error: "Something went wrong. Please try again.",
    });

  }

}