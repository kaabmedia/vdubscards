import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";

export function middleware(request: NextRequest) {
  if (!SHOPIFY_DOMAIN) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(
    `https://${SHOPIFY_DOMAIN}${pathname}${search}`,
    { status: 302 }
  );
}

export const config = {
  matcher: ["/cart/c/:path*", "/checkouts/:path*"],
};
