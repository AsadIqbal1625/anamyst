export const metadata = {
  title: "About Us | ANAMYST Luxury Fragrances",
  description:
    "ANAMYST is a premium fragrance brand crafted to bring elegance, confidence, and identity through scent. Discover our story.",
  alternates: {
    canonical: "https://anamyst.com/about",
  },
};

export default function AboutPage() {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-20 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            Our Story

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">

            About ANAMYST

          </h1>

          <p className="text-gray-300 text-base md:text-xl max-w-3xl mx-auto leading-9">

            ANAMYST is a premium fragrance brand crafted
            to bring elegance, confidence, and identity
            through scent.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 py-16">

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* VISION */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-10 hover:border-[#D4AF37]/40 transition duration-300">

            <p className="uppercase tracking-[4px] text-[#D4AF37] text-xs mb-4">

              Our Vision

            </p>

            <h2 className="text-3xl font-bold mb-6">

              Fragrance Is Identity

            </h2>

            <p className="text-gray-300 leading-9 text-lg">

              We believe fragrance is more than a scent —
              it is personality, emotion, and presence.
              Every ANAMYST perfume is designed to create
              unforgettable impressions with luxurious,
              long-lasting notes.

            </p>

          </div>

          {/* WHY ANAMYST */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-10 hover:border-[#D4AF37]/40 transition duration-300">

            <p className="uppercase tracking-[4px] text-[#D4AF37] text-xs mb-4">

              Why ANAMYST

            </p>

            <h2 className="text-3xl font-bold mb-6">

              Crafted For Presence

            </h2>

            <div className="space-y-5">

              {[
                "Premium Luxury Fragrances",
                "Long Lasting Performance",
                "Inspired by Global Perfume Houses",
                "Elegant Packaging & Identity",
                "Fast & Secure Delivery",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <span className="w-8 h-[1px] bg-[#D4AF37]" />

                  <span className="text-gray-300 text-lg">

                    {item}

                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* BRAND STATEMENT */}
        <div className="max-w-4xl mx-auto text-center mt-20">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-6">

            ANAMYST

          </p>

          <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/90">

            &ldquo;Discover fragrances that define
            your presence.&rdquo;

          </p>

        </div>

      </section>

    </div>

  );

}
