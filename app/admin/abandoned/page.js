"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AbandonedPage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    try {
      const res = await fetch("/api/abandoned-checkout");
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function remove(id) {
    if (!confirm("Remove this record?")) return;
    await fetch(`/api/abandoned-checkout?id=${id}`, { method: "DELETE" });
    fetchItems();
  }

  function waLink(item) {
    const digits = item.phone.replace(/\D/g, "");
    const to = digits.length === 10 ? `91${digits}` : digits;
    const names = item.cart.map((c) => c.name).join(", ");
    const msg = encodeURIComponent(
      `Hi ${item.name || "there"} ✨\n\nWe noticed you left ${names} in your cart at ANAMYST. It's still waiting for you!\n\nComplete your order here: https://www.anamyst.com/cart`
    );
    return `https://wa.me/${to}?text=${msg}`;
  }

  const contactable = (i) => Boolean(i.phone || i.email);

  const visible = items.filter((i) =>
    filter === "contactable"
      ? contactable(i)
      : filter === "anonymous"
      ? !contactable(i)
      : true
  );

  return (
    <div className="text-white space-y-8">
      <p className="text-gray-400">
        Carts that were built but not ordered. Anonymous ones can&apos;t be
        contacted — they&apos;re here so you can see the true size of the
        drop-off. Records auto-delete after 30 days.
      </p>

      {/* SUMMARY */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Open carts",
              value: stats.openCount,
              accent: "#D4AF37",
            },
            {
              label: "Value at risk",
              value: `₹${stats.openValue}`,
              accent: "#eab308",
            },
            {
              label: "Contactable",
              value: `${stats.contactableCount} · ₹${stats.contactableValue}`,
              accent: "#22c55e",
            },
            {
              label: "Recovery rate",
              value: `${stats.recoveryRate}%`,
              accent: "#38bdf8",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-[11px] uppercase tracking-[2px] text-gray-500 mb-1.5">
                {s.label}
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: s.accent }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* FILTERS */}
      {stats && (
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: `All (${stats.openCount})` },
            {
              key: "contactable",
              label: `Contactable (${stats.contactableCount})`,
            },
            {
              key: "anonymous",
              label: `Anonymous (${stats.anonymousCount})`,
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                filter === f.key
                  ? "bg-gold/20 text-gold border-gold/40"
                  : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400 border border-white/10 rounded-2xl p-8 text-center">
          {items.length === 0
            ? "No abandoned carts right now. 🎉"
            : "No carts match this filter."}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {item.name ||
                      (contactable(item) ? "Unknown name" : "Anonymous visitor")}

                    {!contactable(item) && (
                      <span className="text-[10px] uppercase tracking-[1px] text-gray-500 border border-white/15 rounded-full px-2 py-0.5">
                        No contact
                      </span>
                    )}
                  </p>

                  {contactable(item) ? (
                    <p className="text-sm text-gray-400">
                      {[item.phone, item.email].filter(Boolean).join(" · ")}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Left before entering contact details
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    Last active:{" "}
                    {new Date(item.lastActiveAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gold font-bold text-lg">
                    ₹{item.cartValue}
                  </span>

                  {item.phone && (
                    <a
                      href={waLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={
                        item.consentWhatsapp
                          ? "This customer opted in to WhatsApp updates"
                          : "No marketing opt-in on record — this opens a personal WhatsApp chat, don't use it for bulk promotion"
                      }
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition"
                    >
                      WhatsApp Follow-up
                      {!item.consentWhatsapp && " ⚠"}
                    </a>
                  )}

                  <button
                    onClick={() => remove(item._id)}
                    className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {item.cart.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-3 py-2"
                  >
                    {c.image && (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <Image
                          fill
                          sizes="32px"
                          src={c.image}
                          alt={c.name}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs text-gray-300">
                      {c.name} × {c.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
