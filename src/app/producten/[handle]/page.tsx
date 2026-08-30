import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Package, ShieldCheck, Truck, Tag } from "lucide-react";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTION_PAGE_QUERY,
} from "@/lib/shopify/queries";
import type {
  ProductByHandleResponse,
  CollectionPageResponse,
  ShopifyProduct,
} from "@/lib/shopify/types";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductStickyBar } from "@/components/shop/ProductStickyBar";
import { VacationProductNotice } from "@/components/vacation/VacationProductNotice";
import { VacationShippingLabel } from "@/components/vacation/VacationShippingLabel";
import { TrackViewItem } from "@/components/analytics/TrackViewItem";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { InfiniteRelatedProducts } from "@/components/shop/InfiniteRelatedProducts";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const revalidate = 600; // ISR: hervalideer elke 10 minuten (voorraad kan wijzigen)

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

  if (!product) return { title: "Product not found", robots: { index: false } };

  const description = product.description?.slice(0, 160) || `Buy ${product.title} at V-Dub's Cards. Trading card singles shipped across the EU from the Netherlands.`;
  const imageUrl = product.featuredImage?.url;

  return {
    title: product.title,
    description,
    alternates: { canonical: `https://vdubscards.com/producten/${handle}` },
    openGraph: {
      title: `${product.title} | V-Dub's Cards`,
      description,
      url: `https://vdubscards.com/producten/${handle}`,
      type: "website",
      images: imageUrl
        ? [{ url: imageUrl, alt: product.title, width: 800, height: 800 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
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

  // First page of the primary collection for the infinite "More from …" grid.
  // Uses the same defaults as /api/collections/[handle]/products (CREATED desc,
  // available only) so the server page and client-loaded pages share one cursor chain.
  let relatedInitial: ShopifyProduct[] = [];
  let relatedCursor: string | null = null;
  let relatedHasNext = false;
  if (primaryCollection) {
    try {
      const { collection } = await shopifyFetch<CollectionPageResponse>({
        query: COLLECTION_PAGE_QUERY,
        variables: {
          handle: primaryCollection.handle,
          first: 24,
          sortKey: "CREATED",
          reverse: true,
          filters: [{ available: true }],
        },
      });
      if (collection?.products) {
        relatedInitial = collection.products.edges
          .map((e) => e.node)
          .filter((p) => p.id !== product.id);
        relatedCursor = collection.products.pageInfo.endCursor;
        relatedHasNext = collection.products.pageInfo.hasNextPage;
      }
    } catch {
      // Silently fail — related products are optional
    }
  }

  const productUrl = `https://vdubscards.com/producten/${handle}`;
  const priceValidUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": productUrl,
    name: product.title,
    description: product.description || undefined,
    url: productUrl,
    image: images.map((img) => ({
      "@type": "ImageObject",
      url: img.url,
      width: img.width || 800,
      height: img.height || 800,
    })),
    sku: product.id,
    ...(product.productType ? { category: product.productType } : {}),
    ...(product.tags?.length
      ? {
          brand: {
            "@type": "Brand",
            name:
              product.tags.find((t) =>
                ["topps", "panini", "futera", "upper deck", "donruss"].includes(t.toLowerCase())
              ) ?? "V-Dub's Cards",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      priceValidUntil,
      availability: firstVariant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "V-Dub's Cards",
        url: "https://vdubscards.com",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vdubscards.com",
      },
      ...(primaryCollection
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: primaryCollection.title,
              item: `https://vdubscards.com/collections/${primaryCollection.handle}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.title,
              item: productUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.title,
              item: productUrl,
            },
          ]),
    ],
  };

  return (
    <div className="bg-gray-50">
      <TrackViewItem
        item_id={firstVariant?.id ?? product.id}
        item_name={product.title}
        price={price}
        item_category={primaryCollection?.title}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden text-sm text-muted-foreground">
          <Link href="/" className="shrink-0 hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="shrink-0">/</span>
          {primaryCollection ? (
            <>
              <Link
                href={`/collections/${primaryCollection.handle}`}
                className="min-w-0 truncate hover:text-foreground transition-colors"
              >
                {primaryCollection.title}
              </Link>
              <span className="shrink-0">/</span>
            </>
          ) : (
            <>
              <Link
                href="/collections/all"
                className="shrink-0 hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <span className="shrink-0">/</span>
            </>
          )}
          <span className="min-w-0 truncate text-foreground">{product.title}</span>
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
            <div className="mt-6" id="inline-add-to-cart">
              {firstVariant && (
                <AddToCartButton
                  variantId={firstVariant.id}
                  available={firstVariant.availableForSale}
                  quantityAvailable={firstVariant.quantityAvailable}
                  productName={product.title}
                  price={price}
                  category={primaryCollection?.title}
                />
              )}
              <VacationProductNotice />
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
                  <VacationShippingLabel normal="Shipped within 1-3 days" />
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

        {/* Related products — infinite scroll through the collection, 2 across on mobile */}
        {relatedInitial.length > 0 && primaryCollection && (
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
            <InfiniteRelatedProducts
              handle={primaryCollection.handle}
              initialProducts={relatedInitial}
              initialEndCursor={relatedCursor}
              initialHasNextPage={relatedHasNext}
              excludeId={product.id}
            />
          </section>
        )}
      </div>
      <NewsletterSection />

      {/* Mobile sticky Add to bag — keeps the CTA reachable above the fold */}
      {firstVariant && (
        <ProductStickyBar
          variantId={firstVariant.id}
          available={firstVariant.availableForSale}
          quantityAvailable={firstVariant.quantityAvailable}
          productName={product.title}
          price={price}
          category={primaryCollection?.title}
          compareAtPrice={compareAtPrice}
        />
      )}
    </div>
  );
}
