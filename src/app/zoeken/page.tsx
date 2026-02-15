import { shopifyFetch } from "@/lib/shopify/client";
import { SEARCH_QUERY } from "@/lib/shopify/queries";
import type { SearchResponse } from "@/lib/shopify/types";
import { ProductGrid } from "@/components/shop/ProductGrid";
import type { ShopifyProduct } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ZoekenPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Zoeken</h1>
        <p className="text-muted-foreground">
          Voer een zoekterm in via de zoekbalk in de navigatie.
        </p>
      </div>
    );
  }

  const data = await shopifyFetch<SearchResponse>({
    query: SEARCH_QUERY,
    variables: { query, first: 24 },
  }).catch(() => null);

  const nodes = data?.search?.nodes ?? [];
  const products: ShopifyProduct[] = nodes
    .filter((n): n is NonNullable<typeof n> => n != null && "handle" in n && !!n.handle)
    .map((n) => ({
      id: n.id,
      title: n.title,
      handle: n.handle,
      description: n.description ?? "",
      tags: [],
      productType: "",
      priceRange: n.priceRange,
      featuredImage: n.featuredImage,
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">
        Zoekresultaten voor &quot;{query}&quot;
      </h1>
      <p className="text-muted-foreground mb-6">
        {products.length === 0
          ? "Geen producten gevonden."
          : `${products.length} product(en) gevonden.`}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
