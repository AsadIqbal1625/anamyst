/** @type {import('next').NextConfig} */

/* Full policy, in REPORT-ONLY mode: browsers log what it would have blocked
   but block nothing, so it cannot break payments. Once a real checkout
   shows no violations in the console, rename the header below to
   "Content-Security-Policy" to enforce it. */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com",
  "connect-src 'self' https://*.razorpay.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.razorpay.com https://*.google-analytics.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "media-src 'self'",
  "frame-src https://*.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig = {

  reactStrictMode: true,

  images: {

    remotePatterns: [

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

    ],

    formats: [
      "image/avif",
      "image/webp",
    ],

    minimumCacheTTL: 60,

  },

  experimental: {

    optimizePackageImports: [
      "lucide-react",
    ],

  },

  compress: true,

  poweredByHeader: false,

  /* SECURITY HEADERS (applied to every route) */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            /* force HTTPS for 2 years */
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            /* block clickjacking (nobody can iframe the store) */
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            /* stop browsers guessing content types */
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            /* enforced now: these rules can't affect scripts or payments */
            key: "Content-Security-Policy",
            value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: CSP_REPORT_ONLY,
          },
          {
            /* deny hardware APIs the store never uses */
            key: "Permissions-Policy",
            value:
              'camera=(), microphone=(), geolocation=(), payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
          },
        ],
      },
      {
        /* never let admin or API responses be cached by proxies/CDNs */
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

};

export default nextConfig;
