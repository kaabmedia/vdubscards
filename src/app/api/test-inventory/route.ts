import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const QUERY = `
  query { products(first: 1) {
    edges { node {
      variants(first: 1) { edges { node { quantityAvailable } } }
    } }
  } }
`;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

  if (!url) return NextResponse.json({ ok: false }, { status: 400 });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token?.startsWith("shpat_")) {
    headers["Shopify-Storefront-Private-Token"] = token;
  } else if (token) {
    headers["X-Shopify-Storefront-Access-Token"] = token;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: QUERY }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  const qa = json?.data?.products?.edges?.[0]?.node?.variants?.edges?.[0]?.node?.quantityAvailable;

  return NextResponse.json({
    ok: !json.errors?.length,
    quantityAvailable: qa,
    tokenLength: token.length,
    error: json.errors?.[0]?.message,
    errorCode: json.errors?.[0]?.extensions?.code,
  });
}
