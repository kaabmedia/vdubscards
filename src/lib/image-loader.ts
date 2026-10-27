"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Laat Shopify en Sanity zelf de afbeeldingen verkleinen (gratis, via hun eigen CDN)
 * in plaats van Vercel Image Optimization, dat per transformatie en cache-hit rekent.
 * Beide CDN's sturen automatisch WebP/AVIF als de browser dat ondersteunt.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("https://cdn.shopify.com/")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    return url.toString();
  }

  if (src.startsWith("https://cdn.sanity.io/images/")) {
    const url = new URL(src);
    // Bij een vaste uitsnede (w + h) de hoogte meeschalen, zodat de verhouding blijft kloppen.
    const w = Number(url.searchParams.get("w"));
    const h = Number(url.searchParams.get("h"));
    if (w && h) url.searchParams.set("h", String(Math.round((h * width) / w)));
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    return url.toString();
  }

  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  // Bestanden uit /public worden ongewijzigd geserveerd (die zijn al klein gehouden).
  // De query verandert niets aan het bestand, maar voorkomt Next's dev-waarschuwing
  // dat de loader de breedte negeert.
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
