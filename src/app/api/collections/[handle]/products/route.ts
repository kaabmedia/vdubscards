import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { COLLECTION_PAGE_QUERY } from "@/lib/shopify/queries";
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

  let filters: Record<string, unknown>[] = [];
  const filtersRaw = searchParams.get("filters");
  if (filtersRaw) {
    try {
      const parsed = JSON.parse(filtersRaw);
      if (Array.isArray(parsed)) filters = parsed;
    } catch { /* ignore */ }
  }

  const queryVars = {
    handle,
    first: PAGE_SIZE,
    sortKey,
    reverse,
    ...(filters.length > 0 && { filters }),
  };

  try {
    if (targetPage != null && targetPage > 1 && !after) {
      const cacheKey = cursorCacheKey(handle, sortKey, reverse, filters);
      let startFromPage = 1;
      let cursor: string | null = null;

      const cached = getCachedCursor(cacheKey, targetPage);
      if (cached !== undefined) {
        cursor = cached;
        startFromPage = targetPage;
      } else {
        const entry = cursorCache.get(cacheKey);
        if (entry && Date.now() <= entry.expiresAt) {
          for (let p = targetPage - 1; p >= 1; p--) {
            const c = entry.cursors.get(p);
            if (c !== undefined) {
              cursor = c;
              startFromPage = p;
              break;
            }
          }
        }
      }

      let products: unknown[] = [];
      let pageInfo: { hasNextPage: boolean; endCursor: string | null } = {
        hasNextPage: false,
        endCursor: null,
      };

      for (let p = startFromPage; p <= targetPage; p++) {
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

        const edges = coll.products.edges;
        products = edges.map((e: { node: unknown }) => e.node);
        pageInfo = coll.products.pageInfo;

        setCachedCursor(cacheKey, p + 1, pageInfo.endCursor);
        cursor = pageInfo.endCursor;

        if (!pageInfo.hasNextPage && p < targetPage) break;
      }

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
