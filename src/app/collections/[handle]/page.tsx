import Image from "next/image";
import { notFound } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify/client";
import { getCollectionProductCount } from "@/lib/shopify/collection";
import { COLLECTION_PAGE_QUERY } from "@/lib/shopify/queries";
import type { CollectionPageResponse } from "@/lib/shopify/types";
import { CollectionProductGrid } from "@/components/collections/CollectionProductGrid";
import { NewsletterSection } from "@/components/home/NewsletterSection";

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

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  try {
    const data = await shopifyFetch<CollectionPageResponse>({
      query: COLLECTION_PAGE_QUERY,
      variables: { handle, first: 1 },
    });
    const title = data?.collection?.title;
    const description = data?.collection?.description;
    if (!title) return { title: "Collection" };
    return {
      title: `${title} | V-Dub's Cards`,
      description: description
        ? description.slice(0, 160)
        : `View all products in the ${title} collection.`,
    };
  } catch {
    return { title: "Collection" };
  }
}

function parseFiltersParam(raw: string | undefined): Record<string, unknown>[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;
  const sortKeyParam = sp.sortKey;
  const sortKey =
    sortKeyParam &&
    VALID_SORT_KEYS.includes(
      sortKeyParam as (typeof VALID_SORT_KEYS)[number]
    )
      ? sortKeyParam
      : "CREATED";
  const reverse = sp.reverse !== "false";
  const filters = parseFiltersParam(sp.filters);

  const [data, totalProductsCount] = await Promise.all([
    shopifyFetch<CollectionPageResponse>({
      query: COLLECTION_PAGE_QUERY,
      variables: {
        handle,
        first: 24,
        sortKey,
        reverse,
        ...(filters.length > 0 && { filters }),
      },
    }),
    getCollectionProductCount(handle, { sortKey, reverse, filters }),
  ]);

  const collection = data?.collection ?? null;
  if (!collection) notFound();

  const products = collection.products.edges.map((e) => e.node);
  const pageInfo = collection.products.pageInfo;
  const availableFilters = collection.products.filters ?? [];
  const isSaleCollection = handle.toLowerCase() === "sale";

  return (
    <div>
      {/* Hero */}
      {collection.image ? (
        <header className="w-full bg-muted">
          <div className="grid min-h-[220px] md:grid-cols-2 md:min-h-[260px]">
            <div className="relative aspect-[16/9] md:aspect-auto">
              <Image
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 md:px-12 md:py-10">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {collection.title}
              </h1>
              {totalProductsCount != null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {totalProductsCount} product{totalProductsCount !== 1 ? "s" : ""} in this collection
                </p>
              )}
              {collection.description && (
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className="border-b border-border bg-muted/40 px-4 py-10 md:py-14">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
              {collection.title}
            </h1>
            {totalProductsCount != null && (
              <p className="mt-2 text-sm text-muted-foreground">
                {totalProductsCount} product{totalProductsCount !== 1 ? "s" : ""} in this collection
              </p>
            )}
            {collection.description && (
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                {collection.description}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <CollectionProductGrid
          key={JSON.stringify(sp)}
          handle={handle}
          initialProducts={products}
          initialEndCursor={pageInfo.endCursor}
          initialHasNextPage={pageInfo.hasNextPage}
          totalProductsCount={totalProductsCount}
          availableFilters={availableFilters}
          showSaleBadge={isSaleCollection}
        />
      </div>
      <NewsletterSection />
    </div>
  );
}
