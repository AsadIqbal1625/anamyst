
import "./globals.css";
import Script from "next/script";
import SiteShell from "../components/layout/SiteShell";
import { connectDB } from "../lib/mongodb";
import Coupon from "../models/Coupon";

export const metadata = {
  metadataBase: new URL("https://www.anamyst.com"),

  title: "Anamyst | Luxury Perfumes & Premium Fragrances India",

  description:
    "Anamyst is an Indian luxury fragrance brand from Lucknow, offering long-lasting perfumes, attars, fresheners and gift sets.",

      verification: {
    other: {
      "msvalidate.01": "76B6550D116B1E5435C45F1489EB3A75", // Replace with your actual Bing code
    },
  },
  openGraph: {
    title: "ANAMYST | Luxury Perfumes & Premium Fragrances India",
    description:
      "Discover premium luxury perfumes by ANAMYST. Long-lasting fragrances crafted for elegance, sophistication, and everyday luxury.",
    url: "https://www.anamyst.com",
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

/* Fetch the active promo coupon server-side so PromoBar renders with the
   right height on first paint instead of popping in after a client fetch
   (that pop-in was showing up as layout shift / CLS on mobile) */
async function getActiveCoupon() {

  try {

    await connectDB();

    const coupons = await Coupon.find({
      active: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
    })
      .sort({ value: -1 })
      .limit(1)
      .lean();

    if (!coupons.length) return null;

    const c = coupons[0];

    return {
      code: c.code,
      discountType: c.discountType,
      value: c.value,
      minOrder: c.minOrder || 0,
      expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    };

  } catch {

    return null;

  }

}

export default async function RootLayout({ children }) {

  const initialCoupon = await getActiveCoupon();

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
              name: "Anamyst",
              alternateName: ["ANAMYST", "Anamyst Perfumes", "Anamyst Fragrances"],
              url: "https://www.anamyst.com/",
              logo: "https://www.anamyst.com/logo.jpeg",
              description:
                "Anamyst is an Indian luxury fragrance brand based in Lucknow, offering long-lasting perfumes, attars, fresheners and gift sets.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lucknow",
                addressRegion: "Uttar Pradesh",
                addressCountry: "IN",
              },
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
                "https://www.instagram.com/anamyst_official"
              ],
            }),
          }}
        />

        {/* STORE CHROME (navbar/footer hidden on /admin routes) */}

        <SiteShell initialCoupon={initialCoupon}>
          {children}
        </SiteShell>

        {/* Razorpay's checkout.js is loaded on the checkout page itself
            (app/checkout/page.js) — no need to ship it on every page */}

        {/* GOOGLE ANALYTICS (active only when NEXT_PUBLIC_GA_ID is set) */}

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
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