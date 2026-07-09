"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?published=true");
        const data = await res.json();
        if (data.success) setNotices(data.notices || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">
            New Launches
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            Latest Updates
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : notices.length === 0 ? (
          <p className="text-center text-gray-400">
            No updates yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        )}
      </div>
    </div>
  );
}
