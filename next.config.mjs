/** @type {import('next').NextConfig} */

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
            /* deny hardware APIs the store never uses */
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
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
