import type { NextConfig } from "next";

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

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Prevent indexing of private pages via X-Robots-Tag header as well
      {
        source: "/(cart|wishlist|checkout)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
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

  async redirects() {
    return [
      // Old Shopify/pages URL structure → new routes
      { source: "/pages/about-us", destination: "/about", permanent: true },
      { source: "/pages/about", destination: "/about", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/contact-us", destination: "/contact", permanent: true },
      { source: "/pages/faq", destination: "/faq", permanent: true },
      { source: "/pages/shipping", destination: "/shipping", permanent: true },
      { source: "/pages/shipping-policy", destination: "/shipping", permanent: true },
      { source: "/pages/returns", destination: "/returns", permanent: true },
      { source: "/pages/return-policy", destination: "/returns", permanent: true },
      { source: "/pages/refund-policy", destination: "/returns", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/pages/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      { source: "/pages/terms-conditions", destination: "/terms", permanent: true },
      { source: "/pages/terms-of-service", destination: "/terms", permanent: true },
      { source: "/sale", destination: "/collections/sale", permanent: true },
      { source: "/collections/all", destination: "/collections", permanent: true },
      { source: "/products/:handle", destination: "/producten/:handle", permanent: true },
    ];
  },
};

export default nextConfig;
