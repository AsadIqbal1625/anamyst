export const metadata = {
  title: "ANAMYST | Luxury Fragrances",
  description:
    "Discover premium luxury fragrances crafted for elegance, sophistication, and timeless identity.",
  keywords: [
    "luxury perfume",
    "premium fragrance",
    "oud perfume",
    "luxury fragrance india",
    "ANAMYST perfumes",
    "designer perfume",
    "niche fragrance",
  ],
};

import Link from "next/link";

export default function Home() {

  return (

    <main className="w-full bg-black overflow-hidden text-white">

      {/* ================= MOBILE HERO (full-screen video) ================= */}
      <section className="relative w-full min-h-[100dvh] overflow-hidden lg:hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/perfume.mp4"
            type="video/mp4"
          />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-0" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

          <h1 className="text-white text-5xl sm:text-7xl font-semibold tracking-[0.25em] leading-tight">

            ANAMYST

          </h1>

          <p className="text-white/90 text-lg sm:text-2xl mt-6 max-w-2xl leading-relaxed">

            Discover fragrances that define your presence

          </p>

          <Link href="/shop">

            <button className="mt-10 bg-[#D4AF37] hover:bg-[#c19b2e] text-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 font-semibold tracking-wide">

              Explore Collection

            </button>

          </Link>

        </div>

      </section>

      {/* ================= DESKTOP HERO (split layout) ================= */}
      <section className="relative w-full min-h-[92vh] overflow-hidden hidden lg:flex items-center">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-10 grid grid-cols-2 gap-16 items-center w-full">

          {/* LEFT — BRAND */}
          <div>

            <p className="uppercase tracking-[8px] text-[#D4AF37] text-sm mb-8">

              Luxury Fragrance House

            </p>

            <div className="text-white text-7xl xl:text-8xl font-semibold tracking-[0.2em] leading-tight mb-8">

              ANAMYST

            </div>

            <p className="text-white/80 text-2xl max-w-xl leading-relaxed mb-12">

              Discover fragrances that define your presence

            </p>

            <Link href="/shop">

              <button className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black text-xl px-12 py-5 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 font-semibold tracking-wide">

                Explore Collection

              </button>

            </Link>

          </div>

          {/* RIGHT — FRAMED VIDEO */}
          <div className="flex justify-center">

            <div className="relative rounded-[36px] overflow-hidden border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.15)] max-h-[78vh]">

              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-[78vh] w-auto object-cover"
              >
                <source
                  src="/perfume.mp4"
                  type="video/mp4"
                />
              </video>

              {/* SUBTLE BOTTOM FADE */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

            </div>

          </div>

        </div>

      </section>

      {/* SHOP BY COLLECTION */}
      <section className="relative px-6 py-24 border-t border-white/10">
       
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">

            <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

              ANAMYST Collections

            </p>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">

              Shop By Collection

            </h2>

            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-9">

              Explore our curated fragrance categories designed for elegance, luxury, and unforgettable presence.

            </p>

          </div>

          {/* COLLECTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {/* PERFUMES */}
            <Link
              href="/shop/perfumes"
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 hover:border-[#D4AF37]/40 transition duration-500"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-5">

                  Luxury Fragrances

                </p>

                <h3 className="text-4xl font-bold mb-5">

                  Perfumes

                </h3>

                <p className="text-gray-400 leading-8 mb-8">

                  Signature scents crafted for timeless elegance and modern luxury.

                </p>

                <span className="text-[#D4AF37] text-lg font-semibold">

                  Explore →

                </span>

              </div>

            </Link>

            {/* ATTARS */}
            <Link
              href="/shop/attars"
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 hover:border-[#D4AF37]/40 transition duration-500"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-5">

                  Traditional Luxury

                </p>

                <h3 className="text-4xl font-bold mb-5">

                  Attars

                </h3>

                <p className="text-gray-400 leading-8 mb-8">

                  Rich alcohol-free attars inspired by heritage and sophistication.

                </p>

                <span className="text-[#D4AF37] text-lg font-semibold">

                  Explore →

                </span>

              </div>

            </Link>

            {/* FRESHENERS */}
            <Link
              href="/shop/fresheners"
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 hover:border-[#D4AF37]/40 transition duration-500"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-5">

                  Refreshing Experience

                </p>

                <h3 className="text-4xl font-bold mb-5">

                  Fresheners

                </h3>

                <p className="text-gray-400 leading-8 mb-8">

                  Elevate your surroundings with refreshing premium aromas.

                </p>

                <span className="text-[#D4AF37] text-lg font-semibold">

                  Explore →

                </span>

              </div>

            </Link>

            {/* GIFTS */}
            <Link
              href="/shop/premium-gifts"
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 hover:border-[#D4AF37]/40 transition duration-500"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-5">

                  Elegant Gifting

                </p>

                <h3 className="text-4xl font-bold mb-5">

                  Premium Gifts

                </h3>

                <p className="text-gray-400 leading-8 mb-8">

                  Luxurious gifting collections for unforgettable impressions.

                </p>

                <span className="text-[#D4AF37] text-lg font-semibold">

                  Explore →

                </span>

              </div>

            </Link>

            {/* COMBOS */}
            <Link
              href="/shop/combos"
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 hover:border-[#D4AF37]/40 transition duration-500 md:col-span-2 xl:col-span-1"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10">

                <p className="text-[#D4AF37] uppercase tracking-[4px] text-xs mb-5">

                  Curated Bundles

                </p>

                <h3 className="text-4xl font-bold mb-5">

                  Combos

                </h3>

                <p className="text-gray-400 leading-8 mb-8">

                  Carefully paired fragrance collections for premium experiences.

                </p>

                <span className="text-[#D4AF37] text-lg font-semibold">

                  Explore →

                </span>

              </div>

            </Link>

          </div>

        </div>

      </section>

      {/* LUXURY CTA */}
      <section className="px-6 py-24 border-t border-white/10">

        <div className="max-w-5xl mx-auto text-center bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16 relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent" />

          <div className="relative z-10">

            <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

              Luxury Redefined

            </p>

            <h2 className="text-4xl md:text-6xl font-bold mb-8">

              Crafted For Presence

            </h2>

            <p className="text-gray-300 text-lg leading-9 max-w-3xl mx-auto mb-10">

              ANAMYST blends sophistication, elegance, and timeless fragrance artistry into every bottle.

            </p>

            <Link href="/shop">

              <button className="mt-10 bg-[#D4AF37] hover:bg-[#c19b2e] text-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 font-semibold tracking-wide">

                Explore All Collections

              </button>

            </Link>

          </div>

        </div>

      </section>
              {/* WHY CHOOSE ANAMYST */}
        <section className="px-6 py-24 border-t border-white/10 bg-gradient-to-b from-black to-[#0b0b0b]">

          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="text-center mb-16">

              <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

                Why Choose Us

              </p>

              <h2 className="text-4xl md:text-6xl font-bold mb-6">

                The ANAMYST Experience

              </h2>

              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-9">

                Crafted with premium fragrance oils, luxury presentation,
                and timeless elegance for unforgettable impressions.

              </p>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

              {[
                {
                  title: "Authentic Luxury",
                  desc: "Premium perfumes and attars crafted with high-quality fragrance oils.",
                },
                {
                  title: "Long Lasting",
                  desc: "Designed for lasting presence throughout your day and evenings.",
                },
                {
                  title: "Luxury Packaging",
                  desc: "Elegant packaging created for premium gifting experiences.",
                },
                {
                  title: "Secure Checkout",
                  desc: "Fast, secure payments and reliable nationwide delivery.",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-[32px] p-10 hover:border-[#D4AF37]/40 transition duration-500 relative overflow-hidden"
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                  <div className="relative z-10">

                    <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-2xl mb-6">

                      ✦

                    </div>

                    <h3 className="text-2xl font-bold mb-5">

                      {item.title}

                    </h3>

                    <p className="text-gray-400 leading-8">

                      {item.desc}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

    </main>

  );

}