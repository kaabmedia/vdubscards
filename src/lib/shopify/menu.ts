import { unstable_noStore } from "next/cache";
import { shopifyFetch } from "@/lib/shopify/client";
import { MENU_QUERY } from "@/lib/shopify/queries";
import type { MenuResponse, ShopifyMenuItem } from "@/lib/shopify/types";

export interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}

const MENU_HANDLES_TO_TRY = ["main-menu", "main_menu", "header", "navigation"];

/** Zet een volledige Shopify URL om naar een relatief pad voor Next.js routing. */
function toRelativePath(url: string): string {
  if (!url || url === "#") return "#";
  try {
    const parsed = new URL(url);
    // Geef het pad + search + hash terug (zonder origin)
    return parsed.pathname + parsed.search + parsed.hash || "/";
  } catch {
    // Geen geldige URL – neem aan dat het al een relatief pad is
    return url.startsWith("/") ? url : `/${url}`;
  }
}

/** Map Shopify/Online Store paden naar Next.js routes */
const PATH_MAP: Record<string, string> = {
  "/pages/about-us": "/about",
  "/pages/contact": "/contact",
};

function normalizeHref(href: string, label?: string): string {
  const normalizedLabel = (label ?? "").trim().toLowerCase();
  if (normalizedLabel === "events") return "/events";
  return PATH_MAP[href] ?? href;
}

export function itemToNavLink(item: ShopifyMenuItem): NavLink | null {
  if (!item || item.title == null || item.title === undefined) return null;
  const rawUrl = (item.url && String(item.url).trim()) || "#";
  const href = toRelativePath(rawUrl);
  const rawChildren = Array.isArray(item.items) ? item.items : [];
  const children =
    rawChildren.length > 0
      ? rawChildren
          .map(itemToNavLink)
          .filter((link): link is NavLink => link != null)
      : undefined;
  return {
    href: normalizeHref(href, String(item.title)),
    label: String(item.title),
    children: children && children.length > 0 ? children : undefined,
  };
}

export function parseMenuItems(data: MenuResponse | null): NavLink[] {
  const items = data?.menu?.items ?? [];
  return items.map(itemToNavLink).filter((link): link is NavLink => link != null);
}

export function countAllMenuItems(links: NavLink[]): number {
  let n = links.length;
  for (const link of links) {
    if (link.children?.length) n += countAllMenuItems(link.children);
  }
  return n;
}

/** Fallback wanneer Shopify geen menu teruggeeft (verkeerde scope, geen menu, of andere fout). */
export function getDefaultMenuItems(): NavLink[] {
  return [
    {
      href: "/collections/all",
      label: "Shop",
      children: [
        {
          href: "/collections/single-cards",
          label: "Single Cards",
          children: [
            { href: "/collections/soccer-card", label: "Soccer Cards" },
            { href: "/collections/nfl-cards", label: "NFL Cards" },
            { href: "/collections/nba-cards", label: "NBA Cards" },
            { href: "/collections/woman-football-cards", label: "Women's Soccer Cards" },
            { href: "/collections/graded-cards", label: "Graded Cards" },
            { href: "/collections/ufc-cards", label: "UFC Cards" },
            { href: "/collections/f1", label: "F1 Cards" },
            { href: "/collections/entertainment", label: "Entertainment" },
            { href: "/collections/baseball", label: "Baseball Cards" },
            { href: "/collections/wwe-cards", label: "WWE Cards" },
            { href: "/collections/pokemon", label: "Pokemon Cards" },
            { href: "/collections/other-sports", label: "Other Sports" },
          ],
        },
        { href: "/collections/lots-sets", label: "Lots & Sets" },
        { href: "/collections/boxes-packs", label: "Boxes and Packs" },
        { href: "/collections/comics", label: "Comics" },
        { href: "/collections/collectables", label: "Collectibles" },
        { href: "/collections/supplies", label: "Supplies" },
      ],
    },
    { href: "/collections/sale", label: "Sale" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
    { href: "/collections/new-drop", label: "New Drop" },
  ];
}

export async function getMainMenu(): Promise<NavLink[]> {
  unstable_noStore();
  let best: NavLink[] = [];
  let bestCount = 0;

  for (const handle of MENU_HANDLES_TO_TRY) {
    try {
      const data = await shopifyFetch<MenuResponse>({
        query: MENU_QUERY,
        variables: { handle },
      });
      const links = parseMenuItems(data);
      const total = countAllMenuItems(links);
      if (total > bestCount) {
        bestCount = total;
        best = links;
      }
      if (links.length > 0 && total > 0) break;
    } catch {
      continue;
    }
  }

  if (best.length > 0) return best;
  return getDefaultMenuItems();
}
