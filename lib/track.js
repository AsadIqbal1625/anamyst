/* Lightweight client-side event tracking for ANAMYST analytics */

export function getSessionId() {
  if (typeof window === "undefined") return null;

  try {
    let id = localStorage.getItem("anamyst_session");

    if (!id) {
      id =
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 10);
      localStorage.setItem("anamyst_session", id);
    }

    return id;
  } catch {
    return null;
  }
}

export function trackEvent(type, extra = {}) {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    const payload = JSON.stringify({
      type,
      sessionId,
      path: window.location.pathname,
      ...extra,
    });

    // sendBeacon survives page navigation; fetch as fallback
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* never break the store because of tracking */
  }
}
