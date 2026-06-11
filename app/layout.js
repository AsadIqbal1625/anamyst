
import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  metadataBase: new URL("https://anamyst.com"),

  title: "ANAMYST | Luxury Perfumes & Premium Fragrances India",

  description:
    "Discover premium luxury perfumes by ANAMYST. Long-lasting fragrances crafted for elegance, sophistication, and everyday luxury.",

      verification: {
    other: {
      "msvalidate.01": "76B6550D116B1E5435C45F1489EB3A75", // Replace with your actual Bing code
    },
  },
  openGraph: {
    title: "ANAMYST | Luxury Perfumes & Premium Fragrances India",
    description:
      "Discover premium luxury perfumes by ANAMYST. Long-lasting fragrances crafted for elegance, sophistication, and everyday luxury.",
    url: "https://anamyst.com",
    siteName: "ANAMYST",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "ANAMYST Luxury Fragrances",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ANAMYST | Luxury Perfumes & Premium Fragrances India",
    description:
      "Discover premium luxury perfumes by ANAMYST.",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">

      <body className="min-h-screen flex flex-col bg-black text-white">

                <script
                 id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ANAMYST",
              url: "https://anamyst.com",
              logo: "https://anamyst.com/logo.jpeg",
              description:
                "ANAMYST is a premium luxury fragrance brand offering long-lasting perfumes crafted for elegance and sophistication.",
              email: "support@anamyst.com",
              telephone: "+91-8840305018",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-8840305018",
                contactType: "customer support",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://www.instagram.com/anamyst.in"
              ],
            }),
          }}
        />

        {/* NAVBAR */}

        <Navbar />

        {/* MAIN CONTENT */}

        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER */}

        <Footer />

        {/* RAZORPAY SCRIPT */}

        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        
     
      
            {/* MINIMAL LUXURY WHATSAPP */}

      <a
        href="https://wa.me/918840305018?text=Hello%20ANAMYST%20✨%0A%0AI%20need%20help%20choosing%20a%20luxury%20fragrance."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[9999] group"
      >

        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/70 backdrop-blur-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-2xl transition-all duration-300 hover:scale-110">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="white"
            className="w-7 h-7"
          >
            <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 3.135.91 6.066 2.48 8.54L0 32l7.285-2.39a15.93 15.93 0 0 0 8.715 2.56c8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.09c-2.48 0-4.795-.726-6.75-1.97l-.484-.307-4.323 1.418 1.41-4.214-.315-.5A13.29 13.29 0 0 1 2.71 16.4c0-7.326 5.964-13.29 13.29-13.29 7.327 0 13.29 5.964 13.29 13.29 0 7.327-5.963 13.29-13.29 13.29zm7.29-9.94c-.4-.2-2.36-1.16-2.725-1.29-.365-.135-.63-.2-.895.2-.265.4-1.03 1.29-1.26 1.56-.23.265-.465.3-.865.1-.4-.2-1.69-.625-3.22-1.99-1.19-1.06-1.995-2.37-2.23-2.77-.23-.4-.025-.615.175-.81.18-.18.4-.465.6-.695.2-.23.265-.4.4-.665.135-.265.065-.5-.035-.7-.1-.2-.895-2.16-1.225-2.955-.32-.77-.645-.665-.895-.68l-.765-.015c-.265 0-.695.1-1.06.5-.365.4-1.39 1.36-1.39 3.315 0 1.955 1.425 3.845 1.625 4.11.2.265 2.805 4.285 6.8 6.005.95.41 1.69.655 2.265.84.95.3 1.815.255 2.5.155.765-.115 2.36-.965 2.695-1.895.33-.93.33-1.73.23-1.895-.1-.165-.365-.265-.765-.465z"/>
          </svg>

        </div>

        {/* DESKTOP HOVER LABEL */}

        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 border border-[#D4AF37]/20 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">

          <p className="text-xs text-white">

            Need Help?

          </p>

        </div>

      </a>
      

      </body>

    </html>
  );
}