import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { SEARCH_PAGE_QUERY } from "@/lib/shopify/queries";
import type { SearchPageResponse } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

const VALID_SORT_KEYS = ["RELEVANCE", "PRICE"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const after = searchParams.get("after") ?? undefined;
  const sortKeyParam = searchParams.get("sortKey") ?? "RELEVANCE";
  const sortKey = VALID_SORT_KEYS.includes(sortKeyParam as (typeof VALID_SORT_KEYS)[number])
    ? sortKeyParam
    : "RELEVANCE";
  const reverse = searchParams.get("reverse") === "true";

  let filters: Record<string, unknown>[] = [];
  const filtersRaw = searchParams.get("filters");
  if (filtersRaw) {
    try {
      const parsed = JSON.parse(filtersRaw);
      if (Array.isArray(parsed)) filters = parsed;
    } catch {
      /* ignore */
    }
  }

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter q is required" },
      { status: 400 }
    );
  }

  try {
    const data = await shopifyFetch<SearchPageResponse>({
      query: SEARCH_PAGE_QUERY,
      variables: {
        query: q,
        first: 24,
        ...(after && { after }),
        sortKey,
        reverse,
        ...(filters.length > 0 && { productFilters: filters }),
      },
    });

    const search = data?.search;
    if (!search) {
      return NextResponse.json({ products: [], pageInfo: { hasNextPage: false, endCursor: null }, productFilters: [], totalCount: 0 });
    }

    const products = (search.nodes ?? []).filter(
      (n): n is NonNullable<typeof n> => n != null && "handle" in n && !!n.handle
    );
    const pageInfo = search.pageInfo ?? { hasNextPage: false, endCursor: null };
    const productFilters = search.productFilters ?? [];
    const totalCount = search.totalCount ?? 0;

    return NextResponse.json({
      products,
      pageInfo,
      productFilters,
      totalCount,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
