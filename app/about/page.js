export default function AboutPage() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* HEADING */}
        <div className="text-center mb-16">

          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            About Anamyst
          </h1>

          <div className="w-32 h-1 bg-[#D4AF37] mx-auto rounded-full mb-8"></div>

          <p className="text-gray-700 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto">

            Anamyst is a premium fragrance brand crafted to bring elegance,
            confidence, and identity through scent.

          </p>

        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold text-black mb-6">
              Our Vision
            </h2>

            <p className="text-gray-700 leading-8 text-lg">

              We believe fragrance is more than a scent —
              it is personality, emotion, and presence.

              Every Anamyst perfume is designed to create
              unforgettable impressions with luxurious
              long-lasting notes.

            </p>

          </div>

          {/* RIGHT */}
          <div className="bg-black rounded-3xl shadow-xl p-10">

            <h2 className="text-3xl font-bold text-white mb-6">
              Why Anamyst?
            </h2>

            <ul className="space-y-5 text-gray-300 text-lg">

              <li>✨ Premium Luxury Fragrances</li>

              <li>🔥 Long Lasting Performance</li>

              <li>🌍 Inspired by Global Perfume Houses</li>

              <li>💎 Elegant Packaging & Identity</li>

              <li>🚚 Fast & Secure Delivery</li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  );

}