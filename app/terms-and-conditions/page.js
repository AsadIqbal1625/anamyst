export default function TermsPage() {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-16 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            ANAMYST Policies

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">

            Terms & Conditions

          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

            Please read these terms carefully
            before using ANAMYST services.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 py-12">

        <div className="max-w-4xl mx-auto space-y-8">

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Acceptance of Terms

            </h2>

            <p className="text-gray-300 leading-8">

              By accessing or using ANAMYST,
              you agree to comply with these
              terms and conditions, including
              all policies referenced on the website.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Product Information

            </h2>

            <p className="text-gray-300 leading-8">

              We strive to ensure all product
              descriptions, pricing, and images
              are accurate. However, slight
              variations may occur due to
              photography or packaging updates.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Pricing & Payments

            </h2>

            <p className="text-gray-300 leading-8">

              All prices are listed in INR.
              Payments are processed securely
              through trusted payment gateway providers.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Shipping & Delivery

            </h2>

            <p className="text-gray-300 leading-8">

              Delivery timelines may vary
              depending on customer location
              and logistics availability.
              Delays caused by courier partners
              are beyond our direct control.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Intellectual Property

            </h2>

            <p className="text-gray-300 leading-8">

              All branding, logos, designs,
              and website content are the
              intellectual property of ANAMYST
              and may not be reused without permission.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Contact Information

            </h2>

            <p className="text-gray-300 leading-8">

              For questions regarding these
              terms, contact us at:

              <br />
              <br />

              <span className="text-[#D4AF37]">

                team@anamyst.com

              </span>

            </p>

          </div>

        </div>

      </section>

    </div>

  );

}