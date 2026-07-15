import type { Metadata } from "next";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  PRODUCTS_QUERY,
  PRODUCT_POOL_QUERY,
  COLLECTIONS_QUERY,
} from "@/lib/shopify/queries";
import type {
  ProductsResponse,
  CollectionsResponse,
  ShopifyProduct,
  ShopifyCollection,
} from "@/lib/shopify/types";
import { getUpcomingEvents } from "@/lib/sanity/events";
import { getHomeSettings } from "@/lib/sanity/countdown";
import { HeroSection } from "@/components/home/HeroSection";
import { CountdownHeroSection } from "@/components/home/CountdownHeroSection";
import { NewDropSection } from "@/components/home/NewDropSection";
import { ProductSection } from "@/components/home/ProductSection";
import { ProductStrip } from "@/components/home/ProductStrip";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Sports & Trading Card Singles Europe | V-Dub's Cards",
  description:
    "Buy sports and trading card singles from Europe's largest marketplace. Soccer, NBA, NFL, WWE, UFC, F1, graded cards and more. Based in the Netherlands, shipping across the EU.",
  alternates: { canonical: "https://vdubscards.com" },
  openGraph: {
    title: "Sports & Trading Card Singles Europe | V-Dub's Cards",
    description:
      "Buy sports and trading card singles from Europe's largest marketplace. Soccer, NBA, NFL, WWE, UFC, F1, graded cards and more. Based in the Netherlands, shipping across the EU.",
    url: "https://vdubscards.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports & Trading Card Singles Europe | V-Dub's Cards",
    description:
      "Buy sports and trading card singles from Europe's largest marketplace. Soccer, NBA, NFL, WWE, UFC, F1, graded cards and more.",
  },
};

// ISR: hervalideer elke 30 minuten
export const revalidate = 1800;

export default async function HomePage() {
  const [products, collections, pool, events, home] = await Promise.all([
    getProducts(24),
    getCollections(),
    fetchProductPool(),
    getUpcomingEvents(3),
    getHomeSettings(),
  ]);

  const { countdown, heroFloatingCardsSource, heroFloatingCards, newDrop, eventsSlider } = home;

  const countdownEnded =
    countdown.enabled &&
    countdown.endDate &&
    new Date(countdown.endDate).getTime() <= Date.now();

  const showNewDrop = newDrop.enabled && (!countdown.enabled || countdownEnded);

  const productPoolForCards = pool.length > 0 ? pool : products;
  const floatingCards =
    heroFloatingCardsSource === "products"
      ? getHeroCardsFromProducts(productPoolForCards)
      : heroFloatingCards.length > 0
        ? heroFloatingCards.map((c) => ({ url: c.url, alt: c.alt }))
        : getHeroCardsFromProducts(productPoolForCards);

  const newArrivals = products.slice(4, 8);
  const recommendations = getRandomFromPool(pool, 4);
  // Wider selection for the mobile "Popular right now" horizontal strip (above the fold).
  const popularNow = getRandomFromPool(pool, 10);
  const onSaleProducts = getSaleFromPool(pool, 4);

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "V-Dub's Cards",
    url: "https://vdubscards.com",
    image: "https://vdubscards.com/logo-vdubs.png",
    description:
      "One of Europe's largest single-card marketplaces. Sports and trading card singles, graded cards, boxes and packs. Based in the Netherlands, shipping across the EU.",
    email: "Vdubscards@hotmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NL",
    },
    areaServed: { "@type": "Place", name: "European Union" },
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, iDEAL, Bancontact, PayPal, Apple Pay",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Trading Cards",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Soccer Cards" },
        { "@type": "OfferCatalog", name: "NBA Basketball Cards" },
        { "@type": "OfferCatalog", name: "NFL American Football Cards" },
        { "@type": "OfferCatalog", name: "WWE Wrestling Cards" },
        { "@type": "OfferCatalog", name: "UFC Cards" },
        { "@type": "OfferCatalog", name: "F1 Racing Cards" },
        { "@type": "OfferCatalog", name: "Baseball Cards" },
        { "@type": "OfferCatalog", name: "Entertainment Cards" },
        { "@type": "OfferCatalog", name: "Graded Cards" },
        { "@type": "OfferCatalog", name: "Boxes & Packs" },
      ],
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <div className="overflow-visible bg-white">
        {countdown.enabled && countdown.endDate ? (
          <CountdownHeroSection
            endDate={countdown.endDate}
            headline={countdown.headline}
            description={countdown.description}
            backgroundMobile={countdown.backgroundMobile}
            backgroundTablet={countdown.backgroundTablet}
            backgroundDesktop={countdown.backgroundDesktop}
          />
        ) : (
          <HeroSection floatingCards={floatingCards} />
        )}
      </div>

      {/* Mobile: real products above the fold, directly under the compact hero */}
      <div className="md:hidden">
        <ProductStrip
          title="Popular right now"
          products={popularNow}
          viewAllHref="/collections/all"
          viewAllLabel="View all"
        />
      </div>

      {showNewDrop && (
        <NewDropSection
          imageUrl={newDrop.imageUrl}
          title={newDrop.title}
          text={newDrop.text}
          buttonText={newDrop.buttonText}
          buttonLink={newDrop.buttonLink}
        />
      )}
      {/* Desktop keeps the Recommendations grid; mobile uses the strip above instead */}
      <div className="hidden bg-gray-50 md:block">
        <ProductSection
          title="Recommendations"
          products={recommendations}
          viewAllHref="/collections/all"
          viewAllLabel="View all"
        />
      </div>
      <div className="cv-auto bg-white">
        <CollectionsSection collections={collections} />
      </div>
      <div className="cv-auto bg-gray-50">
        <EventsSection
          events={events}
          sliderImages={eventsSlider.enabled ? eventsSlider.images : undefined}
        />
      </div>
      <div className="cv-auto bg-white">
        <ProductSection
          title="New arrivals"
          products={newArrivals}
          viewAllHref="/collections/all"
          viewAllLabel="View all"
        />
      </div>
      <div className="cv-auto bg-gray-50">
        <ProductSection
          title="On sale"
          products={onSaleProducts}
          viewAllHref="/sale"
          viewAllLabel="View all"
          showSaleBadge
        />
      </div>
      <div className="cv-auto">
        <NewsletterSection />
      </div>
    </div>
  );
}

async function getProducts(limit = 24): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: { first: limit },
    });
    return data?.products?.edges?.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}

/** 4 random producten als hero floating cards (url, alt, href). Alleen producten met featuredImage. */
function getHeroCardsFromProducts(
  pool: ShopifyProduct[]
): { url: string; alt?: string; href: string }[] {
  const withImage = pool.filter((p) => p.featuredImage?.url);
  const picked = getRandomFromPool(withImage, 4);
  return picked.map((p) => ({
    url: p.featuredImage!.url,
    alt: p.featuredImage!.altText ?? p.title,
    href: `/producten/${p.handle}`,
  }));
}

/** Willekeurige producten uit pool: shuffle, neem count. */
function getRandomFromPool(
  pool: ShopifyProduct[],
  count: number
): ShopifyProduct[] {
  return shuffle([...pool]).slice(0, count);
}

/** Random sale-producten uit pool (compareAt > price); shuffle, filter sale, neem count. Vult aan met random producten als er te weinig sale zijn. */
function getSaleFromPool(
  pool: ShopifyProduct[],
  count: number
): ShopifyProduct[] {
  const shuffled = shuffle([...pool]);
  const saleProducts = shuffled.filter((p) => {
    const compareAt = parseFloat(
      p.compareAtPriceRange?.minVariantPrice?.amount ?? "0"
    );
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    return compareAt > price;
  });
  const sale = saleProducts.slice(0, count);
  if (sale.length >= count) return sale;
  const rest = shuffled.filter((p) => !sale.includes(p));
  return [...sale, ...rest.slice(0, count - sale.length)];
}

async function fetchProductPool(): Promise<ShopifyProduct[]> {
  // Haalt max 500 producten op (2 pagina's) gefilterd op price ≥ €20 via Shopify API.
  // Resultaat wordt gecached door ISR — geen live fetch per bezoeker.
  const pageSize = 250;
  const maxProducts = 500;
  const pool: ShopifyProduct[] = [];
  let cursor: string | null = null;
  try {
    while (pool.length < maxProducts) {
      const data: ProductsResponse = await shopifyFetch<ProductsResponse>({
        query: PRODUCT_POOL_QUERY,
        variables: { first: pageSize, ...(cursor && { after: cursor }) },
      });
      const edges = data?.products?.edges ?? [];
      const nodes = edges.map((e) => e.node);
      pool.push(...nodes);
      const pageInfo = data?.products?.pageInfo;
      if (!pageInfo?.hasNextPage || !pageInfo.endCursor || nodes.length === 0) break;
      cursor = pageInfo.endCursor;
    }
    return pool;
  } catch {
    return [];
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getCollections(): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<CollectionsResponse>({
      query: COLLECTIONS_QUERY,
      variables: { first: 10 },
    });
    return data?.collections?.edges?.map((e) => e.node) ?? [];
  } catch {
    return [];
  }
}
