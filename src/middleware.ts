import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isVacationActive } from "@/lib/vacation";

/**
 * Country codes to block, ISO 3166-1 alpha-2. Configurable via the
 * BLOCKED_COUNTRIES env var (comma-separated, e.g. "SG,PH"). Defaults to Singapore.
 *
 * NOTE: This blocks at the app layer, so the request still reaches the server before
 * being rejected (unlike an edge WAF like Cloudflare). It stops bots from consuming
 * full page renders / scraping, but does not save edge bandwidth.
 *
 * The visitor's country comes from the `x-vercel-ip-country` header that Vercel's
 * network injects on every request (also falls back to Cloudflare's `cf-ipcountry`
 * if the site ever sits behind Cloudflare). On a plain VPS without a geo-aware proxy,
 * neither header exists and nothing is blocked — that setup needs a GeoIP database.
 */
const BLOCKED_COUNTRIES = new Set(
  (process.env.BLOCKED_COUNTRIES ?? "SG")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
);

function getCountry(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    ""
  ).toUpperCase();
}

/**
 * next.config.ts proxyt de Shopify-checkout door op deze paden, zodat afrekenen op
 * het eigen domein gebeurt. Tijdens de vakantie moeten ze dicht: /api/cart geeft dan
 * geen checkoutUrl meer uit, maar een link uit de browsergeschiedenis of uit een
 * Shopify "verlaten winkelwagen"-mail wijst hier nog steeds naartoe.
 */
const CHECKOUT_PATH_PREFIXES = ["/cart/c/", "/checkouts/", "/payments/"];

function isCheckoutPath(pathname: string): boolean {
  return CHECKOUT_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const country = getCountry(request);
  if (country && BLOCKED_COUNTRIES.has(country)) {
    return new NextResponse("Access denied.", {
      status: 403,
      headers: { "cache-control": "no-store" },
    });
  }

  // Vakantie: stuur elke poging om de doorgeproxyde Shopify-checkout te openen terug
  // naar de winkelmand, waar de vakantiemelding staat.
  if (isVacationActive() && isCheckoutPath(request.nextUrl.pathname)) {
    const cartUrl = new URL("/cart", request.url);
    return NextResponse.redirect(cartUrl, { status: 307 });
  }

  // Expose the visitor's country to client code (e.g. the US shipping notice)
  // without an extra request. Not httpOnly so client JS can read it.
  const response = NextResponse.next();
  if (country) {
    response.cookies.set("visitor_country", country, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }
  return response;
}

export const config = {
  // Run on everything except Next.js internals and static/SEO files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)",
  ],
};
