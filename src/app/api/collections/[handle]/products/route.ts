import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { COLLECTION_PAGE_QUERY, COLLECTION_CURSOR_SKIP_QUERY } from "@/lib/shopify/queries";
import type { CollectionPageResponse } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

const CURSOR_CACHE_TTL_MS = 5 * 60 * 1000;

const cursorCache = new Map<
  string,
  { cursors: Map<number, string | null>; expiresAt: number }
>();

function cursorCacheKey(
  handle: string,
  sortKey: string,
  reverse: boolean,
  filters: Record<string, unknown>[]
): string {
  const filtersStr = JSON.stringify(filters);
  return `${handle}:${sortKey}:${reverse}:${filtersStr}`;
}

function getCachedCursor(
  key: string,
  page: number
): string | null | undefined {
  const entry = cursorCache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return undefined;
  return entry.cursors.get(page);
}

function setCachedCursor(key: string, page: number, cursor: string | null) {
  let entry = cursorCache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    entry = { cursors: new Map(), expiresAt: Date.now() + CURSOR_CACHE_TTL_MS };
    cursorCache.set(key, entry);
  }
  entry.cursors.set(page, cursor);
}

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

const PAGE_SIZE = 24;

export async function GET(
  request: Request,
  { params }: Props
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after") ?? undefined;
  const pageNum = searchParams.get("page");
  const targetPage = pageNum ? Math.max(1, parseInt(pageNum, 10) || 1) : null;
  const sortKeyParam = searchParams.get("sortKey") ?? "CREATED";
  const sortKey = VALID_SORT_KEYS.includes(sortKeyParam as (typeof VALID_SORT_KEYS)[number])
    ? sortKeyParam
    : "CREATED";
  const reverse = searchParams.get("reverse") !== "false";

  let userFilters: Record<string, unknown>[] = [];
  const filtersRaw = searchParams.get("filters");
  if (filtersRaw) {
    try {
      const parsed = JSON.parse(filtersRaw);
      if (Array.isArray(parsed)) userFilters = parsed;
    } catch { /* ignore */ }
  }
  const filters = [{ available: true }, ...userFilters];

  const queryVars = {
    handle,
    first: PAGE_SIZE,
    sortKey,
    reverse,
    filters,
  };

  try {
    if (targetPage != null && targetPage > 1 && !after) {
      const cacheKey = cursorCacheKey(handle, sortKey, reverse, filters);

      // Check if we already have the exact cursor cached
      let cursor: string | null = null;
      let skipRemaining = (targetPage - 1) * PAGE_SIZE;

      const cached = getCachedCursor(cacheKey, targetPage);
      if (cached !== undefined) {
        cursor = cached;
        skipRemaining = 0;
      } else {
        // Find the closest cached cursor to avoid redundant work
        const entry = cursorCache.get(cacheKey);
        if (entry && Date.now() <= entry.expiresAt) {
          for (let p = targetPage - 1; p >= 1; p--) {
            const c = entry.cursors.get(p);
            if (c !== undefined) {
              cursor = c;
              skipRemaining = (targetPage - p) * PAGE_SIZE;
              break;
            }
          }
        }
      }

      // Skip ahead using max batch size (250) with lightweight cursor-only query
      const SHOPIFY_MAX = 250;
      while (skipRemaining > 0) {
        const batchSize = Math.min(skipRemaining, SHOPIFY_MAX);
        const skipData = await shopifyFetch<{ collection: { products: { edges: { node: { id: string } }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } | null }>({
          query: COLLECTION_CURSOR_SKIP_QUERY,
          variables: {
            ...queryVars,
            first: batchSize,
            ...(cursor && { after: cursor }),
          },
        });

        const skipColl = skipData?.collection;
        if (!skipColl) {
          return NextResponse.json({ error: "Collection not found" }, { status: 404 });
        }

        cursor = skipColl.products.pageInfo.endCursor;
        skipRemaining -= batchSize;

        if (!skipColl.products.pageInfo.hasNextPage) break;
      }

      // Cache the cursor for this page
      setCachedCursor(cacheKey, targetPage, cursor);

      // Fetch the actual page data
      const data = await shopifyFetch<CollectionPageResponse>({
        query: COLLECTION_PAGE_QUERY,
        variables: {
          ...queryVars,
          ...(cursor && { after: cursor }),
        },
      });

      const coll = data?.collection;
      if (!coll) {
        return NextResponse.json({ error: "Collection not found" }, { status: 404 });
      }

      const products = coll.products.edges.map((e: { node: unknown }) => e.node);
      const pageInfo = coll.products.pageInfo;

      setCachedCursor(cacheKey, targetPage + 1, pageInfo.endCursor);

      return NextResponse.json({ products, pageInfo });
    }

    const data = await shopifyFetch<CollectionPageResponse>({
      query: COLLECTION_PAGE_QUERY,
      variables: {
        ...queryVars,
        ...(after && { after }),
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

    if (!after && pageInfo.endCursor) {
      const cacheKey = cursorCacheKey(handle, sortKey, reverse, filters);
      setCachedCursor(cacheKey, 2, pageInfo.endCursor);
    }

    return NextResponse.json({ products, pageInfo });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
