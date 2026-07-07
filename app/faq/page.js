export const metadata = {
  title: "FAQ | ANAMYST Luxury Fragrances",
  description:
    "Frequently asked questions about ANAMYST luxury fragrances — longevity, shipping across India, authenticity, and payment options.",
  alternates: {
    canonical: "https://anamyst.com/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are ANAMYST fragrances long lasting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. ANAMYST luxury fragrances are designed to provide long-lasting performance with premium-quality fragrance oils."
      }
    },
    {
      "@type": "Question",
      "name": "Do you ship across India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. ANAMYST ships premium fragrances across India with secure packaging and reliable delivery."
      }
    },
    {
      "@type": "Question",
      "name": "Are your products authentic?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Every ANAMYST product is an authentic luxury fragrance crafted with carefully selected ingredients."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact ANAMYST?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can contact ANAMYST through WhatsApp or the Contact page for fragrance recommendations and order support."
      }
    }
  ]
};

export default function FAQPage() {

  const faqs = [

    {
      q: "Are Anamyst perfumes long lasting?",
      a: "Yes. Our fragrances are crafted with premium oils for excellent longevity."
    },

    {
      q: "Do you deliver across India?",
      a: "Yes, we provide shipping across India with secure checkout."
    },

    {
      q: "Are your fragrances unisex?",
      a: "We offer Men, Women, and Unisex fragrance collections."
    },

    {
      q: "What payment methods do you accept?",
      a: "UPI, Cards, Net Banking, and Cash on Delivery."
    }

  ];

  return (
    <>
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="min-h-screen bg-black text-white overflow-hidden">

        {/* HERO */}
        <section className="relative px-6 py-20 border-b border-[#D4AF37]/20">

          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

          <div className="relative max-w-5xl mx-auto text-center">

            <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

              Help & Support

            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">

              Frequently Asked Questions

            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">

              Everything you need to know about
              ANAMYST fragrances, shipping, and orders.

            </p>

          </div>

        </section>

        {/* FAQ ITEMS */}
        <section className="px-6 py-16">

          <div className="max-w-3xl mx-auto space-y-6">

            {faqs.map((faq, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[28px] p-8 hover:border-[#D4AF37]/40 transition duration-300"
              >

                <div className="flex items-start gap-4">

                  <span className="text-[#D4AF37] text-sm font-semibold mt-1.5">

                    {String(index + 1).padStart(2, "0")}

                  </span>

                  <div>

                    <h2 className="text-xl md:text-2xl font-semibold mb-3">

                      {faq.q}

                    </h2>

                    <p className="text-gray-300 leading-8">

                      {faq.a}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* CONTACT CTA */}
          <div className="max-w-3xl mx-auto mt-14 text-center bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[28px] p-10">

            <p className="uppercase tracking-[5px] text-[#D4AF37] text-xs mb-4">

              Still Have Questions?

            </p>

            <p className="text-gray-300 mb-6">

              Our team is happy to help you choose
              the perfect fragrance.

            </p>

            <a
              href="/contact"
              className="inline-block bg-[#D4AF37] text-black px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition"
            >

              Contact Us

            </a>

          </div>

        </section>

      </div>
    </>
  );

}
