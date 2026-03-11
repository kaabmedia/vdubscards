import type { NextConfig } from "next";

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async redirects() {
    if (!shopifyDomain) return [];
    return [
      {
        source: "/cart/c/:path*",
        destination: `https://${shopifyDomain}/cart/c/:path*`,
        permanent: false,
      },
      {
        source: "/checkouts/:path*",
        destination: `https://${shopifyDomain}/checkouts/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
