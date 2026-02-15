import Link from "next/link";
import Image from "next/image";
import { shopifyFetch } from "@/lib/shopify/client";
import { COLLECTIONS_QUERY } from "@/lib/shopify/queries";
import type { CollectionsResponse, ShopifyCollection } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

async function getAllCollections(): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<CollectionsResponse>({
      query: COLLECTIONS_QUERY,
      variables: { first: 50 },
    });
    return data?.collections?.edges?.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Collections</h1>
        <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
      </div>

      {collections.length === 0 ? (
        <p className="text-muted-foreground">No collections found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-lg font-bold text-white">
                    {collection.title}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/70 group-hover:via-black/20" />
              <span className="absolute bottom-3 left-3 rounded bg-white px-3 py-1 text-xs font-bold text-gray-900 shadow transition-all duration-300 group-hover:bottom-4 group-hover:shadow-lg">
                {collection.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
