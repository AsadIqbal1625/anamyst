/* Meta WhatsApp Cloud API — official, ToS-safe automated messaging.
   No-ops until WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID are set,
   so nothing breaks before the Meta Business account is ready. */

const GRAPH_VERSION = "v21.0";

/* Convert a loosely-typed Indian mobile number into WhatsApp's
   required format: country code + number, no spaces, no +, no leading 0 */
function toWhatsAppNumber(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");

  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) return digits;

  return digits;
}

async function sendTemplateMessage(phone, templateName, bodyParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.log(
      `[WhatsApp] Skipped "${templateName}" — WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID not configured yet.`
    );
    return { skipped: true };
  }

  const to = toWhatsAppNumber(phone);

  if (!to) {
    console.log("[WhatsApp] Skipped — no valid phone number.");
    return { skipped: true };
  }

  try {

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: bodyParams.map((text) => ({
                  type: "text",
                  text: String(text),
                })),
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp] Send failed:", data);
      return { success: false, error: data };
    }

    return { success: true, data };

  } catch (error) {

    console.error("[WhatsApp] Send error:", error.message);
    return { success: false, error: error.message };

  }

}

/* ORDER CONFIRMATION — matches the "order_confirmation" utility
   template: "Hi {{1}}, your ANAMYST order #{{2}} for ₹{{3}} has been
   confirmed! We'll notify you once it ships." */
export async function sendWhatsAppOrderConfirmation(order) {
  return sendTemplateMessage(order.phone, "order_confirmation", [
    order.customerName,
    order.orderId,
    order.totalAmount,
  ]);
}

/* NEW LAUNCH / PROMO BROADCAST — matches a "new_launch_promo" marketing
   template you create once ready to broadcast; adjust params to match
   whatever variables that template ends up using. */
export async function sendWhatsAppPromo(phone, templateName, bodyParams) {
  return sendTemplateMessage(phone, templateName, bodyParams);
}
