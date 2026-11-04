import { Resend } from "resend";
import { escapeHtml as e } from "./escapeHtml";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Alert the store owner about every new order (independent of the
   customer's notification preferences). Never throws — an alert
   failure must not break order placement. */
export async function sendOwnerOrderAlert(order) {
  try {
    /* One or more comma-separated addresses, e.g.
       OWNER_ALERT_EMAIL=you@gmail.com,team@anamyst.com */
    const to = (process.env.OWNER_ALERT_EMAIL || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (to.length === 0) {
      console.warn(
        "[owner alert] OWNER_ALERT_EMAIL not set — skipping owner notification."
      );
      return;
    }

    const items = order.products
      .map((p) => `<li>${e(p.name)} × ${p.quantity} — ₹${p.price * p.quantity}</li>`)
      .join("");

    await resend.emails.send({
      from: "ANAMYST <noreply@anamyst.com>",
      to,
      subject: `${order.needsReview ? "⚠️ NEEDS REVIEW:" : "🛒 New Order"} ${order.orderId} — ₹${order.totalAmount} (${order.paymentMethod})`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>New order on ANAMYST</h2>
          ${
            order.needsReview
              ? `<p style="color:#b91c1c"><b>Needs review:</b> ${e(order.reviewNote)}</p>`
              : ""
          }
          <p>
            <b>${order.orderId}</b> · ₹${order.totalAmount} ·
            ${order.paymentMethod} (${order.paymentStatus})
          </p>
          <p>
            <b>${e(order.customerName)}</b><br/>
            ${e(order.phone)} · ${e(order.email)}<br/>
            ${e(order.address)}, ${e(order.city)}, ${e(order.state)} ${e(order.pincode)}
          </p>
          <ul>${items}</ul>
          <p>
            <a href="https://www.anamyst.com/admin/orders">Open Orders Dashboard</a>
          </p>
        </div>`,
    });
  } catch (error) {
    console.error("owner alert error:", error);
  }
}
