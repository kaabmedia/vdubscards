import { unstable_cache } from "next/cache";
import { shopifyFetch } from "@/lib/shopify/client";
import { COLLECTION_PRODUCTS_COUNT_QUERY } from "@/lib/shopify/queries";

interface CountResponse {
  collection: {
    products: {
      edges: Array<{ node: { id: string } }>;
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } | null;
}

const PAGE_SIZE = 250;
const CACHE_REVALIDATE_SECONDS = 120;

/**
 * Telt het aantal producten in een collectie door te pagineren (Storefront API heeft geen totalCount).
 * Resultaat wordt gecached per handle + sort/filters.
 */
async function fetchCollectionProductCountUncached(
  handle: string,
  sortKey: string,
  reverse: boolean,
  filters: Record<string, unknown>[]
): Promise<number> {
  let total = 0;
  let cursor: string | null = null;

  try {
    for (;;) {
      const data: CountResponse = await shopifyFetch<CountResponse>({
        query: COLLECTION_PRODUCTS_COUNT_QUERY,
        variables: {
          handle,
          first: PAGE_SIZE,
          ...(cursor && { after: cursor }),
          sortKey,
          reverse,
          ...(filters.length > 0 && { filters }),
        },
      });

      const products = data?.collection?.products;
      if (!products) return total;

      const count = products.edges.length;
      total += count;

      if (!products.pageInfo.hasNextPage || !products.pageInfo.endCursor) break;
      cursor = products.pageInfo.endCursor;
    }
  } catch {
    return 0;
  }

  return total;
}

export async function getCollectionProductCount(
  handle: string,
  options: { sortKey: string; reverse: boolean; filters: Record<string, unknown>[] }
): Promise<number> {
  const cacheKey = `collection-count-${handle}-${options.sortKey}-${options.reverse}-${JSON.stringify(options.filters)}`;
  return unstable_cache(
    () =>
      fetchCollectionProductCountUncached(
        handle,
        options.sortKey,
        options.reverse,
        options.filters
      ),
    [cacheKey],
    { revalidate: CACHE_REVALIDATE_SECONDS }
  )();
}
