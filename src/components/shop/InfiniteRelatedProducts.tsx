"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductCard } from "@/components/shop/ProductCard";

interface InfiniteRelatedProductsProps {
  /** Collection handle to paginate through. */
  handle: string;
  initialProducts: ShopifyProduct[];
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
  /** Product to exclude from the list (the one being viewed). */
  excludeId?: string;
}

/**
 * Infinite-scroll grid of products from a collection (2 across on mobile).
 * Loads the next page from /api/collections/[handle]/products as the sentinel
 * scrolls into view. Uses the API's default sort/filter (CREATED desc, available)
 * so the initial server-rendered page and client-loaded pages share one cursor chain.
 */
export function InfiniteRelatedProducts({
  handle,
  initialProducts,
  initialEndCursor,
  initialHasNextPage,
  excludeId,
}: InfiniteRelatedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [cursor, setCursor] = useState<string | null>(initialEndCursor);
  const [hasNext, setHasNext] = useState<boolean>(initialHasNextPage);
  const [loading, setLoading] = useState(false);

  const seenIds = useRef<Set<string>>(
    new Set(initialProducts.map((p) => p.id))
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasNext || !cursor) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/collections/${encodeURIComponent(handle)}/products?after=${encodeURIComponent(cursor)}`
      );
      const data = await res.json();
      const incoming: ShopifyProduct[] = Array.isArray(data?.products)
        ? data.products
        : [];
      const fresh = incoming.filter(
        (p) => p.id !== excludeId && !seenIds.current.has(p.id)
      );
      fresh.forEach((p) => seenIds.current.add(p.id));
      setProducts((prev) => [...prev, ...fresh]);
      setCursor(data?.pageInfo?.endCursor ?? null);
      setHasNext(Boolean(data?.pageInfo?.hasNextPage));
    } catch {
      // Stop trying on error to avoid a tight failure loop.
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNext, cursor, handle, excludeId]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" } // start loading before the user hits the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasNext]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Sentinel + loading state */}
      {hasNext && (
        <div
          ref={sentinelRef}
          className="mt-8 flex items-center justify-center py-4"
        >
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
      )}
      {!hasNext && products.length > 0 && (
        <p className="mt-10 text-center text-xs text-muted-foreground">
          You&apos;ve seen everything in this collection.
        </p>
      )}
    </>
  );
}
