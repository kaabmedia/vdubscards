import type { Metadata, Viewport } from "next";
import { unstable_cache } from "next/cache";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RegionNoticeModal } from "@/components/layout/RegionNoticeModal";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { ShopifyAnalytics } from "@/components/analytics/ShopifyAnalytics";
import { shopifyFetch } from "@/lib/shopify/client";
import { MENU_QUERY, SHOP_ID_QUERY } from "@/lib/shopify/queries";
import type { MenuResponse } from "@/lib/shopify/types";
import {
  parseMenuItems,
  countAllMenuItems,
  getDefaultMenuItems,
  type NavLink,
} from "@/lib/shopify/menu";
import { getHomeSettings } from "@/lib/sanity/countdown";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://vdubscards.com";
const SITE_NAME = "V-Dub's Cards";

// Google Tag Manager — container ID is public (visible in page source).
// GA4 (G-CMB8VQPCR3) wordt binnen GTM gekoppeld, niet hier in code.
const GTM_ID = "GTM-P6QH6S7V";
// Alleen laden in productie zodat lokale dev-bezoeken je analytics niet vervuilen.
const GTM_ENABLED = process.env.NODE_ENV === "production";
const DEFAULT_DESCRIPTION =
  "One of Europe's largest single-card marketplaces. Buy soccer cards, NBA, NFL, WWE, UFC, F1, baseball, entertainment and graded cards. Based in the Netherlands, shipping across the EU.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Sports & Trading Card Singles Europe`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "trading cards", "sports cards", "soccer cards", "football cards", "NBA cards",
    "WWE cards", "UFC cards", "F1 cards", "graded cards", "PSA cards",
    "card singles Europe", "trading card shop Netherlands",
  ],
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Sports & Trading Card Singles Europe`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/logo-vdubs.png",
        width: 512,
        height: 512,
        alt: "V-Dub's Cards logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Sports & Trading Card Singles Europe`,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo-vdubs.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Google Merchant Center website verification (HTML-tag method).
  verification: {
    google: "zJu1G6zb-tfJq9Jr7AbAoMv6yN4ro4vwBkDLjzxXb_k",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [{ color: "#ffffff" }],
};

const MENU_HANDLES = ["main-menu", "main_menu", "header", "navigation"];
const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";

const getCachedMenu = unstable_cache(
  async (): Promise<NavLink[]> => {
    let best: NavLink[] = [];
    let bestCount = 0;
    for (const handle of MENU_HANDLES) {
      try {
        let data: MenuResponse | null = null;
        if (SHOPIFY_STOREFRONT_URL) {
          const res = await fetch(SHOPIFY_STOREFRONT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: MENU_QUERY, variables: { handle } }),
          });
          const json = await res.json().catch(() => ({}));
          if (res.ok && !json.errors?.length) data = (json.data ?? null) as MenuResponse | null;
        }
        if (!data?.menu?.items?.length) {
          data = await shopifyFetch<MenuResponse>({ query: MENU_QUERY, variables: { handle } });
        }
        const links = parseMenuItems(data);
        const total = countAllMenuItems(links);
        if (total > bestCount) { bestCount = total; best = links; }
      } catch { continue; }
    }
    return best.length > 0 ? best : getDefaultMenuItems();
  },
  ["layout-menu"],
  { revalidate: 3600 }
);

const getCachedHomeSettings = unstable_cache(
  async () => getHomeSettings(),
  ["layout-home-settings"],
  { revalidate: 1800 }
);

function filterOutNewDrop(links: NavLink[]): NavLink[] {
  return links
    .filter(
      (link) =>
        link.href !== "/collections/new-drop" && link.label.toLowerCase() !== "new drop"
    )
    .map((link) => ({
      ...link,
      children: link.children ? filterOutNewDrop(link.children) : undefined,
    }));
}

async function getShopId(): Promise<string> {
  try {
    const data = await shopifyFetch<{ shop: { id: string } }>({ query: SHOP_ID_QUERY });
    return data?.shop?.id ?? "";
  } catch {
    return "";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let menuItems = await getCachedMenu();
  if (menuItems.length === 0) menuItems = getDefaultMenuItems();

  const shopId = await getShopId();

  const { newDrop } = await getCachedHomeSettings();
  if (!newDrop.enabled) {
    menuItems = filterOutNewDrop(menuItems);
  }

  // Inject Blog link if not already present in the Shopify menu
  const hasBlog = menuItems.some(
    (l) => l.href === "/blog" || l.label.toLowerCase() === "blog"
  );
  if (!hasBlog) {
    menuItems = [...menuItems, { label: "Blog", href: "/blog" }];
  }

  // New Drop always last
  const newDropItem = menuItems.find(
    (l) => l.href === "/collections/new-drop" || l.label.toLowerCase().trim() === "new drop"
  );
  if (newDropItem) {
    menuItems = [
      ...menuItems.filter((l) => l !== newDropItem),
      newDropItem,
    ];
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-vdubs.png`,
      width: 512,
      height: 512,
    },
    email: "Vdubscards@hotmail.com",
    description: DEFAULT_DESCRIPTION,
    areaServed: { "@type": "Place", name: "European Union" },
    foundingLocation: { "@type": "Place", name: "Netherlands" },
    address: { "@type": "PostalAddress", addressCountry: "NL" },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        {GTM_ENABLED && (
          <script
            id="gtm-init"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {GTM_ENABLED && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          suppressHydrationWarning
        />
        <CartProvider>
          <WishlistProvider>
            <Suspense>
              <ShopifyAnalytics shopId={shopId} />
            </Suspense>
            <AnnouncementBar />
            <Header menuItems={menuItems} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <RegionNoticeModal />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
