
import "./globals.css";
import Script from "next/script";
import SiteShell from "../components/layout/SiteShell";

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

        {/* STORE CHROME (navbar/footer hidden on /admin routes) */}

        <SiteShell>
          {children}
        </SiteShell>

        {/* RAZORPAY SCRIPT */}

        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        {/* GOOGLE ANALYTICS (active only when NEXT_PUBLIC_GA_ID is set) */}

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

      </body>

    </html>
  );
}