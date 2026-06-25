import Customer from "../../../models/Customer";

import {
  generateCustomerId,
  generateOrderId,
  generateInvoiceId,
} from "../../../lib/generateIds";
import { connectDB } from "../../../lib/mongodb";
import { sendOrderEmail } from "../../../lib/sendOrderEmail";
import Order from "../../../models/Order";

/* GET ORDERS */
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}

/* CREATE ORDER */

export async function POST(req) {
console.log("=== ORDER API HIT ===");
  try {

    await connectDB();

    const body =
      await req.json();
      console.log("Order Request Received");

    console.log("Searching customer...");
    let customer =
      await Customer.findOne({
        mobile: body.phone,
      });

    /* NEW CUSTOMER */

          if (!customer) {
            console.log("Creating customer...");
          customer = await Customer.create({

        customerId: await generateCustomerId(),

        name: body.customerName,

        mobile: body.phone,

        email: body.email,

        city: body.city,

        state: body.state,

        address: body.address,

        totalOrders: 1,

        totalSpent: body.totalAmount,

        lastOrderDate: new Date(),

      });

      console.log("Customer Created:", customer.customerId);
        ;

    }

    /* EXISTING CUSTOMER */

    else {

      customer.totalOrders += 1;

      customer.totalSpent +=
        body.totalAmount;

      customer.lastOrderDate =
        new Date();

      await customer.save();

    }

    /* CREATE ORDER */
            console.log("Creating order...");
        const order = await Order.create({

        ...body,

        customerId: customer.customerId,

        orderId: await generateOrderId(),

        invoiceId: await generateInvoiceId(),

      });

      console.log("Order Created:", order.orderId);
      ;

    /* SEND EMAIL */

    await sendOrderEmail(order);

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