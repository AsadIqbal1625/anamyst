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
    <section className="px-6 py-24 border-t border-white/10 bg-gradient-to-b from-black to-[#0b0b0b]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">
            New Launches
          </p>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Latest From ANAMYST
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notices.map((n) => (
            <Link
              key={n._id}
              href={`/notices/${n.slug}`}
              className="group bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-[#D4AF37]/40 transition duration-500"
            >
              {n.image && (
                <div className="relative h-[220px] bg-black/30">
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
              )}

              <div className="p-7">
                <p className="text-[#D4AF37] text-xs mb-3">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <h3 className="text-2xl font-bold mb-3">{n.title}</h3>

                <p className="text-gray-400 leading-7 line-clamp-2">
                  {n.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/notices"
            className="inline-block bg-[#D4AF37] hover:opacity-90 text-black px-8 py-4 rounded-full font-semibold transition"
          >
            View All Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
