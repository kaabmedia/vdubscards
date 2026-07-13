"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

interface ProductStickyBarProps {
  variantId: string;
  available: boolean;
  quantityAvailable?: number | null;
  productName: string;
  price: number;
  category?: string;
  compareAtPrice?: number | null;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Mobile-only sticky bottom bar with price + Add to bag.
 * Slides into view whenever the inline "Add to bag" button (id="inline-add-to-cart")
 * is scrolled out of view — so the CTA is always reachable, even though the large
 * product image pushes the inline button below the fold on phones.
 */
export function ProductStickyBar({
  variantId,
  available,
  quantityAvailable,
  productName,
  price,
  category,
  compareAtPrice,
}: ProductStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("inline-add-to-cart");
    if (!target) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const isOnSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="shrink-0">
          <p
            className={`text-base font-bold leading-none ${
              isOnSale ? "text-sale" : "text-foreground"
            }`}
          >
            {formatPrice(price)}
          </p>
          {isOnSale && compareAtPrice != null && (
            <p className="mt-1 text-xs leading-none text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </p>
          )}
        </div>
        <div className="flex-1">
          <AddToCartButton
            variantId={variantId}
            available={available}
            quantityAvailable={quantityAvailable}
            productName={productName}
            price={price}
            category={category}
          />
        </div>
      </div>
    </div>
  );
}
