import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { getDefaultMenuItems, getMainMenu, type NavLink } from "@/lib/shopify/menu";
import { getHomeSettings } from "@/lib/sanity/countdown";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "V-Dub's Cards | Premium Cards, Comics & Collectibles",
  description:
    "One of Europe's Largest Single-Card Marketplaces. Premium cards, comics & collectibles curated with care.",
};

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

async function fetchMenuItems(): Promise<NavLink[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://${host}`;
    const res = await fetch(`${base}/api/menu`, { cache: "no-store" });
    const data = await res.json();
    if (Array.isArray(data?.menuItems) && data.menuItems.length > 0) return data.menuItems;
  } catch {
    // fallback
  }
  return await getMainMenu();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let menuItems = await fetchMenuItems();
  if (menuItems.length === 0) menuItems = getDefaultMenuItems();

  const { newDrop } = await getHomeSettings();
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
