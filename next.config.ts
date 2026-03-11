import type { NextConfig } from "next";

// Extract myshopify domain from storefront API URL (always set in production)
// Falls back to explicit NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN if set
function getShopifyDomain(): string {
  const explicit = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (explicit) return explicit;
  const apiUrl = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return "";
  }
}

const shopifyDomain = getShopifyDomain();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    if (!shopifyDomain) return [];
    return [
      {
        source: "/cart/c/:path*",
        destination: `https://${shopifyDomain}/cart/c/:path*`,
      },
      {
        source: "/checkouts/:path*",
        destination: `https://${shopifyDomain}/checkouts/:path*`,
      },
      {
        source: "/payments/:path*",
        destination: `https://${shopifyDomain}/payments/:path*`,
      },
    ];
  },
};

export default nextConfig;
