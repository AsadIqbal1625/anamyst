/* WELCOME OFFER — the numbers and small helpers shared by the popup,
   the checkout and the server. Change the offer here, in one place. */

/* rupees off each qualifying order */
export const WELCOME_DISCOUNT = 50;

/* how many of a customer's first orders qualify */
export const WELCOME_ORDER_LIMIT = 2;

const PHONE_KEY = "anamyst_phone";
const SEEN_KEY = "anamyst_welcome_seen";

/* the last 10 digits, so "+91 98765 43210" and "9876543210" match */
export function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

/* Indian mobile numbers are 10 digits starting 6-9 */
export function isValidMobile(value) {
  return /^[6-9]\d{9}$/.test(normalizePhone(value));
}

/* Browser storage can be unavailable (private mode), so every access
   is guarded and simply does nothing when it fails. */

export function getSavedPhone() {
  try {
    return typeof window === "undefined"
      ? ""
      : localStorage.getItem(PHONE_KEY) || "";
  } catch {
    return "";
  }
}

export function savePhone(phone) {
  try {
    localStorage.setItem(PHONE_KEY, normalizePhone(phone));
  } catch {
    /* ignore */
  }
}

export function hasSeenWelcomeOffer() {
  try {
    return Boolean(localStorage.getItem(SEEN_KEY));
  } catch {
    /* cannot remember, so never nag */
    return true;
  }
}

export function markWelcomeOfferSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}
