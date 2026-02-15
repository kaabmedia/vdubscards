import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { COLLECTION_PAGE_QUERY } from "@/lib/shopify/queries";
import type { CollectionPageResponse } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

const VALID_SORT_KEYS = [
  "BEST_SELLING",
  "COLLECTION_DEFAULT",
  "CREATED",
  "ID",
  "MANUAL",
  "PRICE",
  "RELEVANCE",
  "TITLE",
] as const;

type Props = { params: Promise<{ handle: string }> };

export async function GET(
  request: Request,
  { params }: Props
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after") ?? undefined;
  const sortKeyParam = searchParams.get("sortKey") ?? "CREATED";
  const sortKey = VALID_SORT_KEYS.includes(sortKeyParam as (typeof VALID_SORT_KEYS)[number])
    ? sortKeyParam
    : "CREATED";
  const reverse = searchParams.get("reverse") !== "false";

  // Parse generic filters JSON
  let filters: Record<string, unknown>[] = [];
  const filtersRaw = searchParams.get("filters");
  if (filtersRaw) {
    try {
      const parsed = JSON.parse(filtersRaw);
      if (Array.isArray(parsed)) filters = parsed;
    } catch { /* ignore */ }
  }

  try {
    const data = await shopifyFetch<CollectionPageResponse>({
      query: COLLECTION_PAGE_QUERY,
      variables: {
        handle,
        first: 24,
        ...(after && { after }),
        sortKey,
        reverse,
        ...(filters.length > 0 && { filters }),
      },
    });

    const collection = data?.collection ?? null;
    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    const products = collection.products.edges.map((e) => e.node);
    const pageInfo = collection.products.pageInfo;

    return NextResponse.json({ products, pageInfo });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
