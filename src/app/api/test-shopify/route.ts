import { NextResponse } from "next/server";
import { PRODUCTS_QUERY } from "@/lib/shopify/queries";
import type { ProductsResponse } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ontbrekende env: zet NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL in .env.local (bijv. https://jouw-winkel.myshopify.com/api/2024-01/graphql.json)",
      },
      { status: 400 }
    );
  }

  const apiUrl = url;
  const body = JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: 5 } });

  function getHeaders(withToken: boolean): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (withToken && token?.startsWith("shpat_")) {
      h["Shopify-Storefront-Private-Token"] = token;
    } else if (withToken && token) {
      h["X-Shopify-Storefront-Access-Token"] = token;
    }
    return h;
  }
  async function doFetch(withToken: boolean) {
    return fetch(apiUrl, {
      method: "POST",
      headers: getHeaders(withToken),
      body,
      cache: "no-store",
    });
  }

  let res = await doFetch(true);
  let json = await res.json().catch(() => ({}));

  // Bij 401: opnieuw proberen zonder token (tokenless access voor producten)
  if (res.status === 401 && token) {
    res = await doFetch(false);
    json = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    const detail = json?.errors?.[0]?.message ?? json?.message ?? res.statusText;
    return NextResponse.json(
      {
        ok: false,
        error: `Shopify API ${res.status}: ${detail}`,
        debug: {
          tokenLength: token.length,
          urlHost: (() => {
            try {
              return new URL(apiUrl).hostname;
            } catch {
              return "?";
            }
          })(),
        },
        hint:
          res.status === 404
            ? "URL moet exact zijn: https://JOUW-WINKEL.myshopify.com/api/2024-01/graphql.json"
            : undefined,
      },
      { status: 502 }
    );
  }

  if (json.errors?.length) {
    return NextResponse.json(
      {
        ok: false,
        error: json.errors.map((e: { message: string }) => e.message).join(", "),
      },
      { status: 502 }
    );
  }

  const data = json.data as ProductsResponse;
  const products = data?.products?.edges ?? [];
  const count = products.length;

  return NextResponse.json({
    ok: true,
    message: `Shopify verbinding OK. ${count} product(en) opgehaald.${!token ? " (tokenless)" : ""}`,
    productCount: count,
    productTitles: products.map((e) => e.node.title),
  });
}
