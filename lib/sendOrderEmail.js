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
        "ANAMYST <no-reply@anamyst.com>",

      to: order.email,

      subject:
        `Order Confirmed - ${order.orderId}`,

      html: `

<div style="
background:#0a0a0a;
padding:40px 20px;
font-family:Arial,sans-serif;
color:#ffffff;
">

  <div style="
  max-width:700px;
  margin:auto;
  background:#111111;
  border:1px solid rgba(212,175,55,.2);
  border-radius:24px;
  overflow:hidden;
  ">

    <!-- HEADER -->
    <div style="
    text-align:center;
    padding:50px 30px;
    border-bottom:1px solid rgba(212,175,55,.15);
    ">

      <h1 style="
      color:#D4AF37;
      font-size:38px;
      letter-spacing:6px;
      margin:0;
      ">
        ANAMYST
      </h1>

      <p style="
      color:#b8b8b8;
      margin-top:15px;
      letter-spacing:2px;
      ">
        Luxury Perfumes & Attars
      </p>

    </div>

    <!-- THANK YOU -->
    <div style="
    padding:40px 35px;
    ">

      <h2 style="
      color:#D4AF37;
      margin-bottom:20px;
      ">
        Order Confirmed
      </h2>

      <p style="
      color:#dddddd;
      line-height:1.8;
      ">
        Dear ${order.customerName},
        <br/><br/>
        Thank you for choosing ANAMYST.
        Your order has been successfully placed
        and is being prepared with care.
      </p>

      <!-- ORDER ID CARD -->
      <div style="
      background:#161616;
      border:1px solid rgba(212,175,55,.2);
      border-radius:18px;
      padding:25px;
      margin-top:30px;
      ">

        <p style="
        color:#999;
        margin:0;
        ">
          ORDER ID
        </p>

        <h2 style="
        color:#D4AF37;
        margin-top:10px;
        ">
          ${order.orderId}
        </h2>

      </div>

      <!-- PRODUCTS -->
      <div style="
      margin-top:35px;
      ">

        <h3 style="
        color:#D4AF37;
        ">
          Order Summary
        </h3>

        ${order.products
          .map(
            (item) => `
            <div style="
            display:flex;
            justify-content:space-between;
            padding:15px 0;
            border-bottom:1px solid rgba(255,255,255,.05);
            ">

              <div>

                <div style="
                color:#fff;
                font-weight:600;
                ">
                  ${item.name}
                </div>

                <div style="
                color:#888;
                font-size:13px;
                ">
                  Qty: ${item.quantity}
                </div>

              </div>

              <div style="
              color:#D4AF37;
              font-weight:bold;
              ">
                ₹${item.price}
              </div>

            </div>
          `
          )
          .join("")}

      </div>

      <!-- TOTAL -->
      <div style="
      margin-top:30px;
      background:#161616;
      border-radius:18px;
      padding:25px;
      ">

        <div style="
        display:flex;
        justify-content:space-between;
        ">

          <span style="
          color:#999;
          ">
            Total Amount
          </span>

          <span style="
          color:#D4AF37;
          font-size:24px;
          font-weight:bold;
          ">
            ₹${order.totalAmount}
          </span>

        </div>

      </div>

      <!-- TRACK BUTTON -->
      <div style="
      text-align:center;
      margin-top:40px;
      ">

        <a
          href="https://anamyst.com/track-order"
          style="
          background:#D4AF37;
          color:#000;
          text-decoration:none;
          padding:16px 32px;
          border-radius:14px;
          font-weight:bold;
          display:inline-block;
          "
        >
          Track Your Order
        </a>

      </div>

      <!-- ADDRESS -->
      <div style="
      margin-top:40px;
      ">

        <h3 style="
        color:#D4AF37;
        ">
          Shipping Address
        </h3>

        <p style="
        color:#ccc;
        line-height:1.8;
        ">
          ${order.address}<br/>
          ${order.city}<br/>
          ${order.state}<br/>
          ${order.pincode}
        </p>

      </div>

    </div>

    <!-- FOOTER -->
    <div style="
    text-align:center;
    padding:35px;
    border-top:1px solid rgba(212,175,55,.15);
    ">

      <p style="
      color:#888;
      margin-bottom:15px;
      ">
        Thank you for shopping with ANAMYST
      </p>

      <p style="
      color:#555;
      font-size:13px;
      ">
        www.anamyst.com
      </p>

    </div>

  </div>

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