import Link from "next/link";

export default function Home() {

  return (

    <main className="w-full bg-black overflow-hidden text-white">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[100dvh] overflow-hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/perfume.mp4"
            type="video/mp4"
          />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

          {/* TITLE */}
          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.15em] leading-tight">

            ANAMYST

          </h1>

          {/* SUBTITLE */}
          <p className="text-white/90 text-lg sm:text-2xl mt-6 max-w-2xl leading-relaxed">

            Discover fragrances that define your presence

          </p>

          {/* BUTTON */}
          <Link href="/shop">

            <button className="mt-10 bg-[#D4AF37] hover:bg-[#c19b2e] text-black text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 font-semibold">

              Explore Collection

            </button>

          </Link>

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

              <button className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black px-10 py-5 rounded-2xl text-lg font-bold transition duration-300 hover:scale-105">

                Explore All Collections

              </button>

            </Link>

          </div>

        </div>

      </section>

    </main>

  );

}