"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check, Trash2 } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useState } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
  showSaleBadge?: boolean;
}

export function ProductCard({ product, showSaleBadge }: ProductCardProps) {
  const { addLine, removeLine, lines } = useCart();
  const { has: hasInWishlist, toggle: toggleWishlist } = useWishlist();
  const wishlisted = hasInWishlist(product.id);
  const [addedToCart, setAddedToCart] = useState(false);

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const isOnSale =
    showSaleBadge || (compareAtPrice !== null && compareAtPrice > price);

  const firstVariant = product.variants?.edges?.[0]?.node;
  const variantId = firstVariant?.id;
  const quantityAvailable = firstVariant?.quantityAvailable;

  const handleAddToCart = () => {
    if (variantId) {
      addLine(variantId, 1, quantityAvailable ?? undefined);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1500);
    }
  };

  const handleRemove = () => {
    if (variantId) removeLine(variantId);
  };

  const inCart = variantId
    ? lines.find((l) => l.variantId === variantId)?.quantity ?? 0
    : 0;
  const atMax =
    quantityAvailable != null &&
    quantityAvailable > 0 &&
    inCart >= quantityAvailable;

  const secondImage = product.images?.edges?.[1]?.node ?? null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={`/producten/${product.handle}`} className="block h-full">
          {product.featuredImage ? (
            <>
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {secondImage ? (
                <Image
                  src={secondImage.url}
                  alt={secondImage.altText ?? product.title}
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  fill
                  className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </Link>

        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-sale-foreground shadow-sm animate-in fade-in">
            Sale
          </span>
        )}

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-90 ${
            wishlisted
              ? "bg-purple/10 text-purple"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-purple"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 ${
              wishlisted ? "fill-purple text-purple scale-110" : ""
            }`}
          />
        </button>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/producten/${product.handle}`}
          className="group/title"
        >
          <h3 className="line-clamp-1 text-sm font-medium leading-tight text-foreground transition-colors group-hover/title:text-primary">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`text-sm font-bold ${isOnSale ? "text-sale" : "text-foreground"}`}
          >
            &euro;{price.toFixed(2)}
          </span>
          {isOnSale && compareAtPrice !== null && compareAtPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              &euro;{compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to bag / Remove button */}
        {inCart > 0 && atMax ? (
          <button
            onClick={handleRemove}
            disabled={!variantId}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 bg-red-50 transition-colors duration-200 hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!variantId}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-95 disabled:opacity-50 ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white hover:bg-primary hover:text-gray-900 [&_svg]:hover:text-gray-900"
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="h-4 w-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Add to bag
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
