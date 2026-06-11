export default function ContactPage() {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-16 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            Contact ANAMYST

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">

            Let’s Connect

          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

            Whether you need fragrance recommendations,
            order assistance, or luxury gifting support,
            our team is here to assist you.

          </p>

        </div>

      </section>

      {/* CONTACT CARDS */}
      <section className="px-6 py-12">

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

          {/* EMAIL */}
          <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-7 hover:border-[#D4AF37]/50 transition duration-500">

            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">

              <span className="text-2xl">

                ✉️

              </span>

            </div>

            <h2 className="text-2xl font-bold mb-4">

              Email Support

            </h2>

            <p className="text-[#D4AF37] text-lg mb-3 break-all">

              team@anamyst.com

            </p>

            <p className="text-gray-400 leading-7 text-sm">

              Get assistance for orders,
              shipping, fragrances,
              or collaborations.

            </p>

          </div>

          {/* PHONE */}
          <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-7 hover:border-[#D4AF37]/50 transition duration-500">

            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">

              <span className="text-2xl">

                📞

              </span>

            </div>

            <h2 className="text-2xl font-bold mb-4">

              Phone Support

            </h2>

            <p className="text-[#D4AF37] text-lg mb-3">

              +91 8840305018

            </p>

            <p className="text-gray-400 leading-7 text-sm">

              Monday to Saturday
              <br />
              10 AM — 7 PM

            </p>

          </div>

          {/* INSTAGRAM */}
          <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-7 hover:border-[#D4AF37]/50 transition duration-500">

            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">

              <span className="text-2xl">

                📸

              </span>

            </div>

            <h2 className="text-2xl font-bold mb-4">

              Instagram

            </h2>

            <p className="text-[#D4AF37] text-lg mb-3">

              @anamyst_official

            </p>

            <p className="text-gray-400 leading-7 text-sm">

              Discover new launches,
              luxury collections,
              and fragrance stories.

            </p>

          </div>

          {/* ADDRESS */}
          <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-7 hover:border-[#D4AF37]/50 transition duration-500">

            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">

              <span className="text-2xl">

                📍

              </span>

            </div>

            <h2 className="text-2xl font-bold mb-4">

              Business Address

            </h2>

            <p className="text-[#D4AF37] text-lg leading-9">

              ANAMYST Attars & Perfumes
              <br />
              Lucknow, Uttar Pradesh
              <br />
              India

            </p>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="px-6 pb-14">

        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/20 rounded-[36px] p-8 md:p-10 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-5">

            Experience Luxury Fragrance

          </h2>

          <p className="text-gray-300 text-base leading-8 max-w-2xl mx-auto">

            ANAMYST is crafted for individuals
            who appreciate elegance,
            sophistication, and timeless
            fragrance artistry.

          </p>

        </div>

      </section>

    </div>

  );

}