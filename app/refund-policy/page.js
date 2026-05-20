export default function RefundPolicyPage() {

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

            Refund Policy

          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

            We are committed to providing
            premium luxury fragrances with
            the highest quality standards.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 py-12">

        <div className="max-w-4xl mx-auto space-y-8">

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Return Eligibility

            </h2>

            <p className="text-gray-300 leading-8">

              Returns are accepted only if the
              product received is damaged,
              leaking, defective, or incorrect.
              Customers must report issues
              within 24 hours of delivery.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Non-Returnable Products

            </h2>

            <p className="text-gray-300 leading-8">

              Due to hygiene and fragrance
              integrity reasons, opened or used
              perfume products cannot be
              returned or exchanged unless
              damaged during transit.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Refund Processing

            </h2>

            <p className="text-gray-300 leading-8">

              Approved refunds will be processed
              within 7-10 business days to the
              original payment method or bank
              account provided by the customer.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-[#D4AF37]">

              Contact for Refunds

            </h2>

            <p className="text-gray-300 leading-8">

              For refund or replacement requests,
              contact our support team at:

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