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
    <section className="px-6 py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">
            What Our Customers Say
          </p>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Loved By Our Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[#D4AF37]/40 transition duration-500"
            >
              <p className="text-[#D4AF37] text-lg mb-4">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>

              <p className="text-gray-300 leading-8 mb-6">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-4">
                {t.image ? (
                  <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shrink-0">
                    <Image
                      fill
                      sizes="72px"
                      src={t.image}
                      alt={t.name}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-2xl font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-white text-lg">{t.name}</p>
                  {t.location && (
                    <p className="text-gray-500 text-sm">{t.location}</p>
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
