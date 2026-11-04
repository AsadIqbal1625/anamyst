/* Escape text before putting it inside an HTML string (emails, the
   invoice print window). Customer-supplied fields such as name and
   address are attacker-controlled and must never be interpolated raw. */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
