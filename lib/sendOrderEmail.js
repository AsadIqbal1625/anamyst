import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendOrderEmail(order) {

  try {

    const productList = order.products
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
          </tr>
        `
      )
      .join("");

    await resend.emails.send({

      from:
        "ANAMYST <orders@anamyst.com>",

      to: order.email,

      subject:
        `Order Confirmed - ${order.orderId}`,

      html: `
      
      <div style="
        font-family: Arial, sans-serif;
        max-width:700px;
        margin:auto;
        padding:20px;
      ">

        <h1 style="
          color:#D4AF37;
          margin-bottom:10px;
        ">
          ANAMYST
        </h1>

        <p>
          Dear ${order.customerName},
        </p>

        <p>
          Thank you for shopping with ANAMYST.
          Your order has been successfully placed.
        </p>

        <h2>
          Order ID:
          ${order.orderId}
        </h2>

        <table
          width="100%"
          border="1"
          cellspacing="0"
          cellpadding="10"
          style="
            border-collapse:collapse;
          "
        >

          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>

          ${productList}

        </table>

        <br/>

        <p>
          <strong>Total:</strong>
          ₹${order.totalAmount}
        </p>

        <p>
          <strong>Payment:</strong>
          ${order.paymentMethod}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.orderStatus}
        </p>

        <br/>

        <a
          href="https://anamyst.com/track-order?orderId=${order.orderId}"
          style="
            background:#D4AF37;
            color:#000;
            text-decoration:none;
            padding:12px 20px;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Track Order
        </a>

        <br/><br/>

        <p>
          Shipping Address:
        </p>

        <p>
          ${order.address}<br/>
          ${order.city}<br/>
          ${order.state}<br/>
          ${order.pincode}
        </p>

        <hr/>

        <p>
          Thank you for choosing ANAMYST.
        </p>

      </div>

      `,
    });

  } catch (error) {

    console.log(
      "EMAIL ERROR:",
      error
    );

  }

}