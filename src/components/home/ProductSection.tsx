"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductCard } from "@/components/shop/ProductCard";

interface ProductSectionProps {
  title: string;
  products: ShopifyProduct[];
  viewAllHref: string;
  viewAllLabel?: string;
  showSaleBadge?: boolean;
}

export function ProductSection({
  title,
  products,
  viewAllHref,
  viewAllLabel = "View all",
  showSaleBadge,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showSaleBadge={showSaleBadge}
            />
          ))}
        </div>
        <div className="mt-6">
          <Link
            href={viewAllHref}
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5 active:scale-95"
          >
            {viewAllLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
