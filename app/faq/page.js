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

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-6 py-20">

      <div className="max-w-4xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-16">

          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Frequently Asked Questions
          </h1>

          <div className="w-32 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>

        </div>

        {/* FAQ ITEMS */}
        <div className="space-y-6">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200"
            >

              <h2 className="text-2xl font-bold text-black mb-4">

                {faq.q}

              </h2>

              <p className="text-gray-700 leading-7 text-lg">

                {faq.a}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  </>
);

}