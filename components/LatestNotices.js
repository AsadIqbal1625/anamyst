"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LatestNotices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?published=true");
        const data = await res.json();
        if (data.success) setNotices((data.notices || []).slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    }

    fetchNotices();
  }, []);

  if (!notices.length) return null;

  return (
    <section className="px-6 lg:px-10 py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="flex items-center gap-4 uppercase tracking-[0.35em] text-[#D4AF37] text-[11px] mb-6">
            <span className="w-8 h-px bg-[#D4AF37]" />
            New Launches
          </p>

          <h2 className="text-4xl md:text-6xl font-light tracking-tight">
            Latest From <span className="accent">ANAMYST</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notices.map((n) => (
            <Link
              key={n._id}
              href={`/notices/${n.slug}`}
              className="spotlight group overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-colors duration-500"
            >
              {n.image && (
                <div className="relative h-[260px] overflow-hidden bg-white/5">
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-7">
                <p className="text-[#D4AF37] text-[11px] uppercase tracking-[0.25em] mb-3">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <h3 className="text-2xl font-light mb-3">{n.title}</h3>

                <p className="text-white/60 font-light leading-7 line-clamp-2">
                  {n.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/notices"
            className="inline-block border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-300"
          >
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
