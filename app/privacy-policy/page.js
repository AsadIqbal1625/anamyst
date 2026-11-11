export default function PrivacyPolicyPage() {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-16 border-b border-gold/20">

        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-gold text-xs mb-5">

            ANAMYST Policies

          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">

            Privacy Policy

          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

            Your privacy and data security
            are important to us at ANAMYST.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-6 py-12">

        <div className="max-w-4xl mx-auto space-y-8">

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              Information We Collect

            </h2>

            <p className="text-gray-300 leading-8">

              We may collect customer information
              such as name, email address,
              phone number, shipping address,
              and payment details when orders
              are placed on our website.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              How We Use Your Information

            </h2>

            <p className="text-gray-300 leading-8">

              Customer information is used
              only for order processing,
              shipping, support,
              communication, and improving
              the shopping experience at ANAMYST.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              Payment Security

            </h2>

            <p className="text-gray-300 leading-8">

              All payment transactions are
              securely processed through
              trusted payment gateway partners.
              We do not store sensitive card
              or banking information on our servers.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              Data Protection

            </h2>

            <p className="text-gray-300 leading-8">

              We implement reasonable
              security measures to protect
              customer data against
              unauthorized access,
              misuse, or disclosure.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              Third-Party Services

            </h2>

            <p className="text-gray-300 leading-8">

              We may use third-party services
              such as shipping providers,
              analytics tools, and payment gateways
              to operate our business efficiently.

            </p>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">

            <h2 className="text-2xl font-bold mb-5 text-gold">

              Contact Us

            </h2>

            <p className="text-gray-300 leading-8">

              For privacy-related concerns
              or questions, contact us at:

              <br />
              <br />

              <span className="text-gold">

                team@anamyst.com

              </span>

            </p>

          </div>

        </div>

      </section>

    </div>

  );

}