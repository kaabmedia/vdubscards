import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductCardImage } from "@/components/shop/ProductCardImage";

interface ProductStripProps {
  title: string;
  products: ShopifyProduct[];
  viewAllHref: string;
  viewAllLabel?: string;
  /** Number of leading images to mark as priority for LCP (above the fold). */
  priorityCount?: number;
}

function formatPrice(amount: string, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency || "EUR",
  }).format(parseFloat(amount));
}

/**
 * Horizontal, swipeable product strip for the mobile homepage. Rendered directly
 * under the hero so real products sit above the fold. Uses no client JS — native
 * scroll — so it never blocks First Contentful Paint.
 */
export function ProductStrip({
  title,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  priorityCount = 2,
}: ProductStripProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-6">
      <div className="mb-3 flex items-end justify-between px-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
        </div>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {viewAllLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Native horizontal scroll — snaps to each card, no JS */}
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product, i) => {
          const price = product.priceRange.minVariantPrice;
          const compareAt = product.compareAtPriceRange?.minVariantPrice;
          const isOnSale =
            compareAt != null &&
            parseFloat(compareAt.amount) > parseFloat(price.amount);
          return (
            <li key={product.id} className="w-36 shrink-0 snap-start">
              <Link href={`/producten/${product.handle}`} className="group block">
                <ProductCardImage
                  product={product}
                  sizes="144px"
                  priority={i < priorityCount}
                  className="rounded-lg"
                />
                <p className="mt-2 line-clamp-2 text-xs font-medium leading-tight text-foreground">
                  {product.title}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span
                    className={`text-sm font-bold ${
                      isOnSale ? "text-sale" : "text-foreground"
                    }`}
                  >
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {isOnSale && compareAt && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(compareAt.amount, compareAt.currencyCode)}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
