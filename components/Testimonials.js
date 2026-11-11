"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials?published=true");
        const data = await res.json();
        if (data.success) setTestimonials(data.testimonials || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="px-6 lg:px-10 py-24 lg:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="flex items-center gap-4 uppercase tracking-[0.35em] text-gold text-[11px] mb-6">
            <span className="w-8 h-px bg-gold" />
            What Our Customers Say
          </p>

          <h2 className="text-4xl md:text-6xl font-light tracking-tight">
            Loved By Our <span className="accent">Customers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="spotlight border border-white/10 p-8 hover:border-gold/50 transition-colors duration-500"
            >
              <p className="text-gold text-lg mb-4">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>

              <p className="text-white/70 text-lg font-light leading-8 mb-6">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-4">
                {t.image ? (
                  <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gold/30 shrink-0">
                    <Image
                      fill
                      sizes="72px"
                      src={t.image}
                      alt={t.name}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold text-2xl font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="text-white text-lg">{t.name}</p>
                  {t.location && (
                    <p className="text-white/50 text-sm font-light">{t.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
