import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Alert the store owner about every new order (independent of the
   customer's notification preferences). Never throws — an alert
   failure must not break order placement. */
export async function sendOwnerOrderAlert(order) {
  try {
    const to = process.env.OWNER_ALERT_EMAIL || "team@anamyst.com";

    const items = order.products
      .map((p) => `<li>${p.name} × ${p.quantity} — ₹${p.price * p.quantity}</li>`)
      .join("");

    await resend.emails.send({
      from: "ANAMYST <noreply@anamyst.com>",
      to,
      subject: `🛒 New Order ${order.orderId} — ₹${order.totalAmount} (${order.paymentMethod})`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>New order on ANAMYST</h2>
          <p>
            <b>${order.orderId}</b> · ₹${order.totalAmount} ·
            ${order.paymentMethod} (${order.paymentStatus})
          </p>
          <p>
            <b>${order.customerName}</b><br/>
            ${order.phone} · ${order.email}<br/>
            ${order.address}, ${order.city}, ${order.state} ${order.pincode}
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
