"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TABS = [
  { key: "pending", label: "Waiting" },
  { key: "approved", label: "Approved" },
  { key: "hidden", label: "Hidden" },
  { key: "all", label: "All" },
];

const BADGE = {
  pending: "bg-yellow-500/15 text-yellow-300",
  approved: "bg-green-500/15 text-green-300",
  hidden: "bg-white/10 text-gray-400",
};

export default function ReviewsAdminPage() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {

    let alive = true;

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.success) setReviews(data.reviews || []);
        else setMessage(data.error || "Could not load reviews");
      })
      .catch(() => alive && setMessage("Could not load reviews"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };

  }, [version]);

  async function setStatus(review, status) {

    const res = await fetch(`/api/reviews/${review._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setMessage(data.success ? "" : data.error || "Could not update review");
    setVersion((v) => v + 1);

  }

  async function remove(review) {

    if (!confirm("Delete this review for good? The customer could then write it again.")) return;

    await fetch(`/api/reviews/${review._id}`, { method: "DELETE" });
    setVersion((v) => v + 1);

  }

  const count = (key) =>
    key === "all" ? reviews.length : reviews.filter((r) => r.status === key).length;

  const shown =
    tab === "all" ? reviews : reviews.filter((r) => r.status === tab);

  return (

    <div className="text-white space-y-6">

      <p className="text-gray-400">
        Reviews from customers with delivered orders. Nothing appears on the
        site until you approve it. Hide spam or abuse, but keep genuine
        reviews even when they&apos;re critical.
      </p>

      <p className="text-gray-400 text-sm">
        Share this link with customers after delivery:{" "}
        <span className="text-[#D4AF37] select-all">www.anamyst.com/review</span>
      </p>

      <div className="flex flex-wrap gap-2">

        {TABS.map((t) => (

          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm border transition ${
              tab === t.key
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "border-white/10 text-gray-300 hover:border-[#D4AF37]/50"
            }`}
          >
            {t.label} ({count(t.key)})
          </button>

        ))}

      </div>

      {message && <p className="text-red-400 text-sm">{message}</p>}

      {loading ? (

        <p className="text-gray-400">Loading reviews…</p>

      ) : shown.length === 0 ? (

        <p className="text-gray-500">No reviews here yet.</p>

      ) : (

        <div className="space-y-4">

          {shown.map((r) => (

            <div
              key={r._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >

              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">

                <Link
                  href={`/product/${r.productId}`}
                  target="_blank"
                  className="font-semibold hover:text-[#D4AF37]"
                >
                  {r.productName || "Product"}
                </Link>

                <span className={`text-xs px-3 py-1 rounded-full ${BADGE[r.status]}`}>
                  {r.status}
                </span>

              </div>

              <p className="text-[#D4AF37] mb-2">
                {"★".repeat(r.rating)}
                <span className="text-gray-600">{"★".repeat(5 - r.rating)}</span>
              </p>

              <p className="text-gray-200 leading-7 whitespace-pre-line mb-3">
                {r.text}
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {r.name} · Order {r.orderId} ·{" "}
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-wrap gap-2">

                {r.status !== "approved" && (
                  <button
                    onClick={() => setStatus(r, "approved")}
                    className="px-4 py-2 rounded-xl text-sm bg-green-600 hover:bg-green-500 transition"
                  >
                    Approve
                  </button>
                )}

                {r.status !== "hidden" && (
                  <button
                    onClick={() => setStatus(r, "hidden")}
                    className="px-4 py-2 rounded-xl text-sm border border-white/15 hover:border-white/40 transition"
                  >
                    Hide
                  </button>
                )}

                <button
                  onClick={() => remove(r)}
                  className="px-4 py-2 rounded-xl text-sm text-red-400 border border-red-500/30 hover:border-red-500/60 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}
