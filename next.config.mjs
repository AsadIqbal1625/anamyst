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

};

export default nextConfig;
