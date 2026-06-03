import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/", "/wishlist/", "/search/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/", "/wishlist/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/", "/wishlist/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/"],
        disallow: ["/api/", "/cart/", "/checkout/"],
      },
    ],
    sitemap: "https://vdubscards.com/sitemap.xml",
    host: "https://vdubscards.com",
  };
}
