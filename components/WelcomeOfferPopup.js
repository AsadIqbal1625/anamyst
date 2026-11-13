"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getCart } from "../lib/cart";
import { getSessionId } from "../lib/track";
import {
  WELCOME_DISCOUNT,
  WELCOME_ORDER_LIMIT,
  getSavedPhone,
  hasSeenWelcomeOffer,
  isValidMobile,
  markWelcomeOfferSeen,
  normalizePhone,
  savePhone,
} from "../lib/welcomeOfferConfig";

/* WELCOME OFFER POPUP
   Appears once per visitor, the first time something is added to the
   cart, offering a small discount in return for a WhatsApp number.
   Always closable: shopping continues either way. The number is saved
   with the visitor's cart, so the cart can be followed up even if they
   never reach checkout. */

const ORDERS_TEXT =
  WELCOME_ORDER_LIMIT === 1
    ? "your first order"
    : `each of your first ${WELCOME_ORDER_LIMIT} orders`;

export default function WelcomeOfferPopup() {

  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const timer = useRef(null);

  /* the checkout asks for the number itself */
  const blocked =
    pathname.startsWith("/checkout") || pathname.startsWith("/order-success");

  useEffect(() => {

    const onCart = () => {

      if (blocked || hasSeenWelcomeOffer() || getSavedPhone()) return;

      if (getCart().length === 0) return;

      /* once per visitor, whether they accept or close it */
      markWelcomeOfferSeen();

      /* let the "added to cart" confirmation show first */
      timer.current = setTimeout(() => setOpen(true), 700);

    };

    window.addEventListener("cartUpdated", onCart);

    return () => {
      window.removeEventListener("cartUpdated", onCart);
      clearTimeout(timer.current);
    };

  }, [blocked]);

  useEffect(() => {

    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);

  }, [open]);

  async function claim(e) {

    e.preventDefault();

    if (!isValidMobile(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setBusy(true);
    setError("");

    try {

      const sessionId = getSessionId();

      /* 1. save the cart with this number, so it is contactable */
      await fetch("/api/abandoned-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          phone: normalizePhone(phone),
          cart: getCart().map((i) => ({
            productId: i._id,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      }).catch(() => {});

      /* 2. claim the offer */
      const res = await fetch("/api/welcome-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim", phone, sessionId }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      /* the checkout starts with this number already filled in */
      savePhone(phone);

      /* lets the cart show the discount straight away */
      window.dispatchEvent(new Event("welcomeOfferClaimed"));

      setResult(data.eligible ? "unlocked" : "used");

    } catch {

      setError("Something went wrong. Please try again.");

    } finally {

      setBusy(false);

    }

  }

  if (!open) return null;

  return (

    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 bg-[rgba(0,0,0,0.72)] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-offer-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-black text-white border border-gold/40 p-7 sm:p-9 shadow-2xl"
      >

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-white/60 hover:text-gold transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="uppercase tracking-[0.35em] text-gold text-[10px] mb-4">
          A Welcome Gift
        </p>

        {result ? (

          <>

            <h2 id="welcome-offer-title" className="text-2xl sm:text-3xl font-light tracking-tight mb-4">
              {result === "unlocked"
                ? `₹${WELCOME_DISCOUNT} off unlocked`
                : "Thank you"}
            </h2>

            <p className="text-white/70 font-light leading-relaxed mb-7">
              {result === "unlocked"
                ? `Your ₹${WELCOME_DISCOUNT} off is applied automatically at checkout on ${ORDERS_TEXT}, when you order with this mobile number.`
                : "This number has already enjoyed the welcome offer. Your cart is saved, and we're here if you need any help."}
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full bg-gold text-black py-4 text-sm uppercase tracking-[0.2em] font-medium hover:opacity-90 transition"
            >
              Continue Shopping
            </button>

          </>

        ) : (

          <form onSubmit={claim}>

            <h2 id="welcome-offer-title" className="text-2xl sm:text-3xl font-light tracking-tight mb-3">
              Enjoy ₹{WELCOME_DISCOUNT} off
            </h2>

            <p className="text-white/70 font-light leading-relaxed mb-6">
              Share your WhatsApp number and get ₹{WELCOME_DISCOUNT} off{" "}
              {ORDERS_TEXT}.
            </p>

            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
              placeholder="10-digit WhatsApp number"
              aria-label="WhatsApp number"
              className="w-full bg-white/5 border border-white/15 px-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:border-gold transition-colors"
            />

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full mt-4 bg-gold text-black py-4 text-sm uppercase tracking-[0.2em] font-medium hover:opacity-90 disabled:opacity-60 transition"
            >
              {busy ? "Unlocking…" : `Unlock ₹${WELCOME_DISCOUNT} Off`}
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full mt-3 py-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              No thanks
            </button>

            <p className="text-white/40 text-[11px] leading-relaxed mt-4">
              By continuing, you agree to receive WhatsApp messages from
              ANAMYST about your cart and offers. You can ask us to stop at
              any time. The offer cannot be combined with a coupon code.
            </p>

          </form>

        )}

      </div>

    </div>

  );

}
