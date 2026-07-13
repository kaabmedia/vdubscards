import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
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
    const desc = description
      ? description.slice(0, 160)
      : `Shop ${title} singles at V-Dub's Cards. Trading card singles shipped across the EU from the Netherlands.`;
    return {
      title,
      description: desc,
      alternates: { canonical: `https://vdubscards.com/collections/${handle}` },
      openGraph: {
        title: `${title} | V-Dub's Cards`,
        description: desc,
        url: `https://vdubscards.com/collections/${handle}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | V-Dub's Cards`,
        description: desc,
      },
    };
  } catch {
    return { title: "Collection" };
  }
}

/**
 * Generate likely alternate handles for a 404'd collection so we can 301-redirect
 * instead of showing a dead page. Handles the common singular/plural mismatch
 * (e.g. "soccer-cards" ↔ "soccer-card") that breaks nav links.
 */
function alternateHandles(handle: string): string[] {
  const candidates = new Set<string>();
  if (handle.endsWith("-cards")) candidates.add(handle.slice(0, -1)); // -cards → -card
  else if (handle.endsWith("-card")) candidates.add(`${handle}s`); // -card → -cards
  if (handle.endsWith("s")) candidates.add(handle.slice(0, -1)); // strip trailing s
  else candidates.add(`${handle}s`); // add trailing s
  candidates.delete(handle);
  return [...candidates];
}

/** Returns the first alternate handle that resolves to a real collection, or null. */
async function findExistingAlternate(handle: string): Promise<string | null> {
  for (const alt of alternateHandles(handle)) {
    try {
      const data = await shopifyFetch<CollectionPageResponse>({
        query: COLLECTION_PAGE_QUERY,
        variables: { handle: alt, first: 1 },
      });
      if (data?.collection) return alt;
    } catch {
      // ignore and try the next candidate
    }
  }
  return null;
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
  const userFilters = parseFiltersParam(sp.filters);
  const filters = [{ available: true }, ...userFilters];

  const [data, totalProductsCount] = await Promise.all([
    shopifyFetch<CollectionPageResponse>({
      query: COLLECTION_PAGE_QUERY,
      variables: {
        handle,
        first: 24,
        sortKey,
        reverse,
        filters,
      },
    }),
    getCollectionProductCount(handle, { sortKey, reverse, filters }),
  ]);

  const collection = data?.collection ?? null;
  if (!collection) {
    // Try a singular/plural variant before giving up (301 to the correct URL).
    const alt = await findExistingAlternate(handle);
    if (alt) permanentRedirect(`/collections/${alt}`);
    notFound();
  }

  const products = collection.products.edges.map((e) => e.node);
  const pageInfo = collection.products.pageInfo;
  const availableFilters = (collection.products.filters ?? []).filter((f) => f.id !== "filter.v.availability");
  const isSaleCollection = handle.toLowerCase() === "sale";
  const collectionUrl = `https://vdubscards.com/collections/${handle}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": collectionUrl,
    name: collection.title,
    description: collection.description || undefined,
    url: collectionUrl,
    ...(collection.image ? { image: collection.image.url } : {}),
    mainEntity: {
      "@type": "ItemList",
      name: collection.title,
      numberOfItems: totalProductsCount ?? products.length,
      itemListElement: products.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `https://vdubscards.com/producten/${p.handle}`,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        suppressHydrationWarning
      />
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
