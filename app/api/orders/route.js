import Customer from "../../../models/Customer";

import {
  generateCustomerId,
  generateOrderId,
  generateInvoiceId,
} from "../../../lib/generateIds";
import { connectDB } from "../../../lib/mongodb";
import { sendOrderEmail } from "../../../lib/sendOrderEmail";
import Order from "../../../models/Order";
import Coupon from "../../../models/Coupon";

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

  try {

    await connectDB();

    const body =
      await req.json();
      

    
    let customer =
      await Customer.findOne({
        mobile: body.phone,
      });

    /* NEW CUSTOMER */

          if (!customer) {
         
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
            
        const order = await Order.create({

        ...body,

        customerId: customer.customerId,

        orderId: await generateOrderId(),

        invoiceId: await generateInvoiceId(),

      });

     
      ;

    /* COUNT COUPON USAGE */

    if (body.couponCode) {

      await Coupon.updateOne(
        { code: body.couponCode },
        { $inc: { usedCount: 1 } }
      ).catch(() => {});

    }

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