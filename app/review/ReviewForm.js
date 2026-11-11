"use client";

import { useState } from "react";
import Image from "next/image";

const inputClass =
  "w-full bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-gold transition-colors";

function StarPicker({ value, onChange }) {

  return (

    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">

      {[1, 2, 3, 4, 5].map((star) => (

        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className={`text-3xl leading-none transition-colors ${
            star <= value ? "text-gold" : "text-white/20 hover:text-white/40"
          }`}
        >
          ★
        </button>

      ))}

    </div>

  );

}

export default function ReviewForm() {

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function send(payload) {

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, phone, ...payload }),
    });

    return res.json();

  }

  async function findOrder(e) {

    e.preventDefault();
    setBusy("lookup");
    setError("");

    try {

      const data = await send({ action: "lookup" });

      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setProducts(data.products);
      setName((current) => current || data.name || "");

    } catch {

      setError("Something went wrong. Please try again.");

    } finally {

      setBusy("");

    }

  }

  function updateDraft(productId, change) {

    setDrafts((all) => ({
      ...all,
      [productId]: { rating: 0, text: "", ...all[productId], ...change },
    }));

  }

  async function submitReview(productId) {

    const draft = drafts[productId] || {};

    setBusy(productId);
    updateDraft(productId, { error: "" });

    try {

      const data = await send({
        action: "submit",
        productId,
        name,
        rating: draft.rating,
        text: draft.text,
      });

      if (!data.success) {
        updateDraft(productId, { error: data.error });
        return;
      }

      setProducts((list) =>
        list.map((p) =>
          p.productId === productId ? { ...p, reviewed: true } : p
        )
      );

    } catch {

      updateDraft(productId, {
        error: "Something went wrong. Please try again.",
      });

    } finally {

      setBusy("");

    }

  }

  return (

    <main className="min-h-[70vh] bg-black text-white px-6 py-16 lg:py-24">

      <div className="max-w-2xl mx-auto">

        <p className="flex items-center gap-4 uppercase tracking-[0.35em] text-gold text-[11px] mb-6">
          <span className="w-8 h-px bg-gold" />
          Your Experience
        </p>

        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
          Write a Review
        </h1>

        <p className="text-white/60 font-light leading-relaxed mb-10">
          Reviews come only from customers whose order has been delivered.
          Enter your Order ID and the phone number you ordered with.
        </p>

        {!products && (

          <form onSubmit={findOrder} className="space-y-4">

            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID (from your confirmation)"
              required
              className={inputClass}
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number used on the order"
              inputMode="tel"
              required
              className={inputClass}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={busy === "lookup"}
              className="bg-gold hover:bg-gold-bright disabled:opacity-60 text-black px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-colors"
            >
              {busy === "lookup" ? "Finding your order…" : "Find My Order"}
            </button>

          </form>

        )}

        {products && (

          <div className="space-y-6">

            {products.length === 0 && (
              <p className="text-white/60">
                The products from this order are no longer in our shop, so they
                can&apos;t be reviewed.
              </p>
            )}

            {products.length > 0 && (

              <div>

                <label className="block text-[11px] uppercase tracking-[0.25em] text-white/50 mb-2">
                  Name shown with your review
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="Your first name"
                  className={inputClass}
                />

              </div>

            )}

            {products.map((p) => {

              const draft = drafts[p.productId] || { rating: 0, text: "" };

              return (

                <div
                  key={p.productId}
                  className="border border-white/10 p-5 md:p-6"
                >

                  <div className="flex items-center gap-4 mb-5">

                    {p.image && (
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-white/5">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <h2 className="text-lg font-light">{p.name}</h2>

                  </div>

                  {p.reviewed ? (

                    <p className="text-gold">
                      ✓ Thank you! Your review will appear once it has been checked.
                    </p>

                  ) : (

                    <div className="space-y-4">

                      <StarPicker
                        value={draft.rating}
                        onChange={(rating) => updateDraft(p.productId, { rating })}
                      />

                      <textarea
                        value={draft.text}
                        onChange={(e) =>
                          updateDraft(p.productId, { text: e.target.value })
                        }
                        maxLength={1000}
                        rows={4}
                        placeholder="How does it smell? How long does it last?"
                        className={inputClass}
                      />

                      {draft.error && (
                        <p className="text-red-400 text-sm">{draft.error}</p>
                      )}

                      <button
                        type="button"
                        onClick={() => submitReview(p.productId)}
                        disabled={busy === p.productId}
                        className="bg-gold hover:bg-gold-bright disabled:opacity-60 text-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
                      >
                        {busy === p.productId ? "Sending…" : "Submit Review"}
                      </button>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

    </main>

  );

}
