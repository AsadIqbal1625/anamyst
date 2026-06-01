import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendOrderEmail(order) {

  try {

    const productList =
      order.products
        ?.map(
          (item) =>
            `${item.name} x ${item.quantity}`
        )
        .join("<br/>");

    await resend.emails.send({

      from:
        "ANAMYST <orders@anamyst.in>",

      to: order.email,

      subject:
        `Order Confirmed - ${order.orderId}`,

      html: `
      
      <div style="font-family:Arial;padding:20px;max-width:600px;margin:auto;">

        <h1 style="color:#D4AF37;">
          ANAMYST
        </h1>

        <p>
          Thank you for your order.
        </p>

        <h3>
          Order ID:
          ${order.orderId}
        </h3>

        <hr/>

        <h3>
          Order Details
        </h3>

        <p>
          ${productList}
        </p>

        <p>
          <strong>
            Total:
          </strong>
          ₹${order.totalAmount}
        </p>

        <p>
          <strong>
            Payment:
          </strong>
          ${order.paymentMethod}
        </p>

        <p>
          <strong>
            Status:
          </strong>
          ${order.orderStatus}
        </p>

        <br/>

        <a
          href="https://anamyst.vercel.app/track-order?orderId=${order.orderId}"
          style="
            background:#D4AF37;
            color:black;
            padding:12px 24px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Track Order
        </a>

        <br/><br/>

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