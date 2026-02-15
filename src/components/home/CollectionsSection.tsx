import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ShopifyCollection } from "@/lib/shopify/types";

interface CollectionsSectionProps {
  collections: ShopifyCollection[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  if (collections.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Popular Collections
          </h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {collections.slice(0, 5).map((collection) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-lg font-bold text-white">
                    {collection.title}
                  </span>
                </div>
              )}
              {/* Gradient overlay - darkens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/70 group-hover:via-black/20" />
              {/* Label badge - slides up on hover */}
              <span className="absolute bottom-3 left-3 rounded bg-white px-3 py-1 text-xs font-bold text-gray-900 shadow transition-all duration-300 group-hover:bottom-4 group-hover:shadow-lg">
                {collection.title}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href="/collections"
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5 active:scale-95"
          >
            View all collections
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
