import { getCart } from "./cart";
import { getSessionId } from "./track";

/* ABANDONED-CART SNAPSHOTS

   Records the cart against the browser's session id whenever it
   changes, so every abandoned cart is captured — not only the ones
   belonging to visitors who reached checkout and typed a contact.

   Fire-and-forget: tracking must never break the store. */

const DEBOUNCE_MS = 4000;

function buildPayload() {

  const sessionId = getSessionId();

  if (!sessionId) return null;

  const cart = getCart();

  if (!Array.isArray(cart) || cart.length === 0) return null;

  return JSON.stringify({

    sessionId,

    cart: cart.map((i) => ({
      productId: i._id,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    })),

  });

}

function send(payload, { beacon = false } = {}) {

  if (!payload) return;

  try {

    if (beacon && navigator.sendBeacon) {

      navigator.sendBeacon(
        "/api/abandoned-checkout",
        new Blob([payload], { type: "application/json" })
      );

      return;

    }

    fetch("/api/abandoned-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});

  } catch {
    /* never break the store because of tracking */
  }

}

/* Starts listening; returns a cleanup function. */
export function startCartSync() {

  if (typeof window === "undefined") return () => {};

  let timer = null;

  const schedule = () => {

    clearTimeout(timer);

    timer = setTimeout(() => {
      send(buildPayload());
    }, DEBOUNCE_MS);

  };

  /* a visitor who leaves quickly would otherwise never be recorded,
     so flush immediately when the page is being hidden/closed */
  const flush = () => {

    clearTimeout(timer);

    send(buildPayload(), { beacon: true });

  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") flush();
  };

  window.addEventListener("cartUpdated", schedule);
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", onVisibility);

  /* capture a cart that already existed when this page loaded */
  schedule();

  return () => {

    clearTimeout(timer);

    window.removeEventListener("cartUpdated", schedule);
    window.removeEventListener("pagehide", flush);
    document.removeEventListener("visibilitychange", onVisibility);

  };

}
