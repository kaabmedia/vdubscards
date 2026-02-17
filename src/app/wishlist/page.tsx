"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { NewsletterSection } from "@/components/home/NewsletterSection";

const FETCH_TIMEOUT_MS = 12000;

export default function WishlistPage() {
  const { productIds, hydrated } = useWishlist();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const productIdsKey = useMemo(
    () => productIds.join(","),
    [productIds]
  );

  useEffect(() => {
    if (!hydrated) return;
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const idsParam = productIds.map((id) => encodeURIComponent(id)).join("&ids=");
    const url = `/api/wishlist-products?ids=${idsParam}`;
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products ?? []);
      })
      .catch(() => setProducts([]))
      .finally(() => {
        clearTimeout(timeoutId);
        abortRef.current = null;
        setLoading(false);
      });
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
      abortRef.current = null;
    };
  }, [hydrated, productIdsKey, productIds]);

  if (!hydrated || loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold mb-6">Mijn wishlist</h1>
          <p className="text-muted-foreground">Laden...</p>
        </div>
        <NewsletterSection />
      </>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold mb-6">Mijn wishlist</h1>
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/30 py-16 text-center">
            <Heart className="h-16 w-16 text-purple/50 mb-4" />
            <p className="text-muted-foreground mb-4">Je wishlist is leeg.</p>
            <Button asChild>
              <Link href="/collections/all">Naar shop</Link>
            </Button>
          </div>
        </div>
        <NewsletterSection />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Mijn wishlist ({products.length})
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <NewsletterSection />
    </>
  );
}
