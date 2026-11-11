import Link from "next/link";

const stars = (rating) => {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(full) + "☆".repeat(5 - full);
};

/* Approved customer reviews, rendered on the server so search engines
   see the same reviews as the structured data. */
export default function ProductReviews({ reviews, stats }) {

  return (

    <section
      id="reviews"
      className="px-6 py-16 md:py-20 border-t border-white/10 scroll-mt-28"
    >

      <div className="max-w-4xl mx-auto">

        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">

          <div>

            <p className="uppercase tracking-[0.35em] text-gold text-[11px] mb-4">
              Customer Reviews
            </p>

            {stats.count > 0 ? (

              <p className="flex items-center gap-3 text-2xl font-light">
                <span className="text-gold">{stars(stats.average)}</span>
                {stats.average.toFixed(1)}
                <span className="text-white/50 text-base">
                  from {stats.count} {stats.count === 1 ? "review" : "reviews"}
                </span>
              </p>

            ) : (

              <p className="text-white/60 font-light">
                No reviews yet. Bought this fragrance? Be the first to share.
              </p>

            )}

          </div>

          <Link
            href="/review"
            className="border border-white/30 hover:border-gold hover:text-gold px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors"
          >
            Write a Review
          </Link>

        </div>

        {reviews.length > 0 && (

          <div className="divide-y divide-white/10 border-y border-white/10">

            {reviews.map((r) => (

              <article key={String(r._id)} className="py-6">

                <p className="text-gold mb-2" aria-label={`${r.rating} out of 5 stars`}>
                  {stars(r.rating)}
                </p>

                <p className="text-white/80 font-light leading-7 whitespace-pre-line mb-3">
                  {r.text}
                </p>

                <p className="text-white/50 text-sm">
                  {r.name} · Verified Buyer ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>

  );

}
