import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { MENU_QUERY } from "@/lib/shopify/queries";
import type { MenuResponse } from "@/lib/shopify/types";
import {
  parseMenuItems,
  countAllMenuItems,
  getDefaultMenuItems,
} from "@/lib/shopify/menu";

export const dynamic = "force-dynamic";

const MENU_HANDLES_TO_TRY = ["main-menu", "main_menu", "header", "navigation"];

const SHOPIFY_URL = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

/** Tokenloos menu ophalen; soms geeft dat wel geneste items (scope met token beperkt). */
async function fetchMenuTokenless(
  handle: string
): Promise<MenuResponse | null> {
  if (!SHOPIFY_URL) return null;
  const res = await fetch(SHOPIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: MENU_QUERY,
      variables: { handle },
    }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors?.length) return null;
  return (json.data ?? null) as MenuResponse | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get("debug") === "1";

  let best: { links: ReturnType<typeof parseMenuItems>; raw: MenuResponse | null } = {
    links: [],
    raw: null,
  };
  let bestCount = 0;

  for (const handle of MENU_HANDLES_TO_TRY) {
    try {
      // Eerst tokenloos proberen (vaak meer geneste items)
      let data: MenuResponse | null = await fetchMenuTokenless(handle);
      if (!data?.menu?.items?.length && SHOPIFY_TOKEN) {
        data = await shopifyFetch<MenuResponse>({
          query: MENU_QUERY,
          variables: { handle },
        });
      }
      const links = parseMenuItems(data);
      const total = countAllMenuItems(links);
      if (total > bestCount) {
        bestCount = total;
        best = { links, raw: data };
      }
    } catch {
      continue;
    }
  }

  if (best.links.length === 0) best = { links: getDefaultMenuItems(), raw: null };

  if (debug) {
    return NextResponse.json({
      menuItems: best.links,
      rawShopifyMenu: best.raw,
      totalItemCount: countAllMenuItems(best.links),
    });
  }
  return NextResponse.json({ menuItems: best.links });
}
