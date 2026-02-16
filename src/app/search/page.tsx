import { shopifyFetch } from "@/lib/shopify/client";
import { SEARCH_PAGE_QUERY } from "@/lib/shopify/queries";
import type { SearchPageResponse } from "@/lib/shopify/types";
import { SearchProductGrid } from "@/components/search/SearchProductGrid";
import type { ShopifyProduct } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

function parseFiltersParam(raw: string | undefined): Record<string, unknown>[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type Props = { searchParams: Promise<{ q?: string; sortKey?: string; reverse?: string; filters?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-4 text-2xl font-semibold">Search</h1>
        <p className="text-muted-foreground">
          Enter a search term in the search bar in the navigation.
        </p>
      </div>
    );
  }

  const sortKeyParam = sp.sortKey ?? "RELEVANCE";
  const reverse = sp.reverse !== "false";
  const filters = parseFiltersParam(sp.filters);

  const data = await shopifyFetch<SearchPageResponse>({
    query: SEARCH_PAGE_QUERY,
    variables: {
      query,
      first: 24,
      sortKey: sortKeyParam === "PRICE" ? "PRICE" : "RELEVANCE",
      reverse,
      ...(filters.length > 0 && { productFilters: filters }),
    },
  }).catch(() => null);

  const search = data?.search ?? null;
  const nodes = search?.nodes ?? [];
  const products: ShopifyProduct[] = nodes.filter(
    (n): n is NonNullable<typeof n> => n != null && "handle" in n && !!n.handle
  );
  const pageInfo = search?.pageInfo ?? { hasNextPage: false, endCursor: null };
  const availableFilters = search?.productFilters ?? [];
  const totalCount = search?.totalCount ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">
        Search results for &quot;{query}&quot;
      </h1>
      <p className="mb-6 text-muted-foreground">
        {products.length === 0 && !data
          ? "Searching..."
          : totalCount != null
            ? `${totalCount} product${totalCount !== 1 ? "s" : ""} found.`
            : `${products.length} product${products.length !== 1 ? "s" : ""} found.`}
      </p>
      <SearchProductGrid
        key={`${query}-${sp.sortKey ?? ""}-${sp.reverse ?? ""}-${sp.filters ?? ""}`}
        query={query}
        initialProducts={products}
        initialEndCursor={pageInfo.endCursor}
        initialHasNextPage={pageInfo.hasNextPage}
        totalProductsCount={totalCount}
        availableFilters={availableFilters}
      />
    </div>
  );
}
