import { Resend } from "resend";
import { escapeHtml as e } from "./escapeHtml";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function sendOrderEmail(order) {

  try {

    /* Rows are tables on purpose: Gmail and Outlook ignore flexbox, which
       left prices stuck against the product name. */

    const rupees = (value) =>
      `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

    const summaryRow = (label, value, color = "#cccccc") => `
          <tr>
            <td style="padding:6px 0;color:#999999;font-size:14px;">${label}</td>
            <td align="right" style="padding:6px 0;color:${color};font-size:14px;white-space:nowrap;">${value}</td>
          </tr>`;

    const discount = Number(order.discount) || 0;
    const shipping = Number(order.shippingCost) || 0;
    const codFee = Number(order.codFee) || 0;

    const subtotal = order.products.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    const { data, error } = await resend.emails.send({

      from:
        "ANAMYST <noreply@anamyst.com>",

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
        Dear ${e(order.customerName)},
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
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #222222;">
              <tr>

                <td style="padding:15px 16px 15px 0;vertical-align:top;">

                  <div style="color:#ffffff;font-weight:600;line-height:1.5;">
                    ${e(item.name)}
                  </div>

                  <div style="color:#888888;font-size:13px;margin-top:4px;">
                    Qty: ${Number(item.quantity) || 1} × ${rupees(item.price)}
                  </div>

                </td>

                <td align="right" style="padding:15px 0;vertical-align:top;color:#D4AF37;font-weight:bold;white-space:nowrap;">
                  ${rupees((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                </td>

              </tr>
            </table>
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

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

          ${summaryRow("Subtotal", rupees(subtotal))}

          ${
            discount > 0
              ? summaryRow(
                  order.couponCode
                    ? `Discount (${e(order.couponCode)})`
                    : "Discount",
                  `−${rupees(discount)}`,
                  "#4ade80"
                )
              : ""
          }

          ${summaryRow("Shipping", shipping > 0 ? rupees(shipping) : "Free")}

          ${codFee > 0 ? summaryRow("Cash on Delivery fee", rupees(codFee)) : ""}

          <tr><td colspan="2" style="height:10px;line-height:10px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:16px 0 0;border-top:1px solid #2a2a2a;color:#ffffff;font-size:16px;font-weight:bold;">
              Total Amount
            </td>
            <td align="right" style="padding:16px 0 0;border-top:1px solid #2a2a2a;color:#D4AF37;font-size:24px;font-weight:bold;white-space:nowrap;">
              ${rupees(order.totalAmount)}
            </td>
          </tr>

        </table>

      </div>

      <!-- TRACK BUTTON -->
      <div style="
      text-align:center;
      margin-top:40px;
      ">

        <a
          href="https://www.anamyst.com/track-order"
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
          ${e(order.address)}<br/>
          ${e(order.city)}<br/>
          ${e(order.state)}<br/>
          ${e(order.pincode)}
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

    if (error) {

      console.error("order email refused:", order.orderId, error);

      return {
        ok: false,
        error: String(error.message || error.name || "Email service refused the email"),
      };

    }

    return { ok: true, id: data?.id || "" };

  } catch (error) {

    console.error("order email failed:", order.orderId, error);

    return {
      ok: false,
      error: String(error?.message || "Could not reach the email service"),
    };

  }

}