import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { shopifyFetch } from "@/lib/shopify/client";
import { MENU_QUERY } from "@/lib/shopify/queries";
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
});

export const metadata: Metadata = {
  title: "V-Dub's Cards | Premium Cards, Comics & Collectibles",
  description:
    "One of Europe's Largest Single-Card Marketplaces. Premium cards, comics & collectibles curated with care.",
};

const MENU_HANDLES = ["main-menu", "main_menu", "header", "navigation"];
const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";

/** Cached menu fetch: tries tokenless first (more nested items), falls back to token-based. Cached 1 hour. */
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

/** Cached home settings: used for newDrop menu toggle. Cached 30 minutes. */
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
      children: link.children
        ? filterOutNewDrop(link.children)
        : undefined,
    }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let menuItems = await getCachedMenu();
  if (menuItems.length === 0) menuItems = getDefaultMenuItems();

  const { newDrop } = await getCachedHomeSettings();
  if (!newDrop.enabled) {
    menuItems = filterOutNewDrop(menuItems);
  }

  return (
    <html lang="nl">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar />
            <Header menuItems={menuItems} />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
