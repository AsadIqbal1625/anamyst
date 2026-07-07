export const metadata = {
  title: "Shipping Policy | ANAMYST",
  description:
    "ANAMYST shipping policy — delivery timelines, shipping charges, order processing, and tracking information for luxury fragrance orders across India.",
  alternates: {
    canonical: "https://anamyst.com/shipping-policy",
  },
};

export default function ShippingPolicyPage() {

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

            Shipping Policy

          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

            We deliver premium luxury
            fragrances across India with
            secure packaging and reliable
            courier partners.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 py-12">

        <div className="max-w-4xl mx-auto space-y-8">

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Order Processing

            </h2>

            <p className="text-gray-300 leading-8">

              Orders are processed within 1-2
              business days after payment
              confirmation. Orders placed on
              weekends or public holidays are
              processed on the next business day.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Delivery Timelines

            </h2>

            <p className="text-gray-300 leading-8">

              Standard delivery takes 3-7
              business days depending on your
              location. Metro cities typically
              receive orders within 3-5 business
              days, while remote areas may take
              up to 7-10 business days.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Shipping Coverage & Charges

            </h2>

            <p className="text-gray-300 leading-8">

              We currently ship all over India.
              Shipping charges, if applicable,
              are displayed at checkout before
              payment. We do not ship
              internationally at this time.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Order Tracking

            </h2>

            <p className="text-gray-300 leading-8">

              Once your order is shipped, you
              will receive a confirmation email
              with tracking details. You can also
              track your order anytime using the
              Track Order page on our website.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Damaged or Delayed Shipments

            </h2>

            <p className="text-gray-300 leading-8">

              All packages are securely sealed
              and quality-checked before
              dispatch. If your package arrives
              damaged or is significantly
              delayed, contact our support team
              within 24 hours of delivery at:

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
