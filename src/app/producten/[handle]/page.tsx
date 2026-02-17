import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Package, ShieldCheck, Truck, Tag } from "lucide-react";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_BY_COLLECTION_QUERY,
} from "@/lib/shopify/queries";
import type {
  ProductByHandleResponse,
  CollectionWithProductsResponse,
  ShopifyProduct,
} from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const { product } = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.title} | V-Dub's Cards`,
    description: product.description?.slice(0, 160) || undefined,
  };
}

function formatPrice(amount: string | number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const { product } = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  if (!product) {
    notFound();
  }

  const firstVariant = product.variants?.edges?.[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice =
    product.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
      : null;
  const isOnSale = compareAtPrice !== null && compareAtPrice > price;
  const discount = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // All product images
  const images =
    product.images?.edges?.map((e) => e.node) ??
    (product.featuredImage ? [product.featuredImage] : []);

  // Find the primary collection (skip "all" or generic collections)
  const collections = product.collections?.edges?.map((e) => e.node) ?? [];
  const primaryCollection =
    collections.find(
      (c) =>
        c.handle !== "all" &&
        c.handle !== "frontpage" &&
        !c.handle.startsWith("hidden-")
    ) ?? collections[0];

  // Fetch related products from same collection, ranked by title similarity
  let relatedProducts: ShopifyProduct[] = [];
  if (primaryCollection) {
    try {
      const { collection } =
        await shopifyFetch<CollectionWithProductsResponse>({
          query: PRODUCTS_BY_COLLECTION_QUERY,
          variables: { handle: primaryCollection.handle, first: 250 },
        });
      if (collection?.products?.edges) {
        const STOP_WORDS = new Set([
          "the", "a", "an", "of", "in", "on", "at", "to", "for", "and", "or",
          "is", "it", "by", "with", "from", "-", "–", "/", "|", "card", "cards",
          "kaart", "kaarten", "psa", "cgc",
        ]);
        const titleWords = product.title
          .toLowerCase()
          .split(/[\s\-–/|,()]+/)
          .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

        const candidates = collection.products.edges
          .map((e) => e.node)
          .filter((p) => p.id !== product.id);

        // Score each candidate by how many title words match
        const scored = candidates.map((p) => {
          const pTitle = p.title.toLowerCase();
          const score = titleWords.reduce(
            (s, word) => s + (pTitle.includes(word) ? 1 : 0),
            0,
          );
          return { product: p, score };
        });

        scored.sort((a, b) => b.score - a.score);
        relatedProducts = scored.slice(0, 4).map((s) => s.product);
      }
    } catch {
      // Silently fail — related products are optional
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          {primaryCollection ? (
            <>
              <Link
                href={`/collections/${primaryCollection.handle}`}
                className="hover:text-foreground transition-colors"
              >
                {primaryCollection.title}
              </Link>
              <span>/</span>
            </>
          ) : (
            <>
              <Link
                href="/collections/all"
                className="hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <span>/</span>
            </>
          )}
          <span className="truncate text-foreground">{product.title}</span>
        </nav>

        {/* Product section */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Left: Image gallery */}
          <div className="md:sticky md:top-24 md:self-start">
            <ProductImageGallery images={images} title={product.title} />
          </div>

          {/* Right: Product info */}
          <div>
            {/* Tags */}
            {product.productType && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.productType}
              </p>
            )}

            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span
                className={`text-2xl font-bold ${isOnSale ? "text-sale" : "text-foreground"}`}
              >
                {formatPrice(price)}
              </span>
              {isOnSale && compareAtPrice !== null && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                  <span className="rounded-md bg-sale/10 px-2 py-0.5 text-xs font-bold text-sale">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">Inc. VAT</p>

            {/* Availability */}
            {firstVariant && (
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    firstVariant.availableForSale
                      ? "bg-emerald-500"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {firstVariant.availableForSale ? "In stock" : "Sold out"}
                </span>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-6">
              {firstVariant && (
                <AddToCartButton
                  variantId={firstVariant.id}
                  available={firstVariant.availableForSale}
                  quantityAvailable={firstVariant.quantityAvailable}
                />
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5">
                <Truck className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Free shipping from &euro;125
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Secure payment
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5">
                <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Shipped within 1-3 days
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5">
                <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  14-day returns
                </span>
              </div>
            </div>

            {/* Description */}
            {(product.descriptionHtml || product.description) && (
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
                  Description
                </h2>
                <div
                  className="prose prose-sm prose-neutral max-w-none text-muted-foreground prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.descriptionHtml || product.description,
                  }}
                />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.slice(0, 8).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && primaryCollection && (
          <section className="mt-16 border-t border-border pt-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  More from {primaryCollection.title}
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
              </div>
              <Link
                href={`/collections/${primaryCollection.handle}`}
                className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-4 sm:hidden">
              <Link
                href={`/collections/${primaryCollection.handle}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        )}
      </div>
      <NewsletterSection />
    </div>
  );
}
