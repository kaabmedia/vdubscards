// GA4 e-commerce events pushed to the Google Tag Manager dataLayer.
//
// In GTM these arrive as Custom Events: `view_item`, `add_to_cart` and
// `begin_checkout`. Forward them to GA4 with GA4 Event tags that read the
// `ecommerce` object from the dataLayer. See docs/analytics.md for the exact
// GTM/GA4 configuration steps.
//
// If GTM is not loaded (e.g. local dev) these pushes are harmless no-ops —
// they just queue in window.dataLayer with nothing consuming them.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const CURRENCY = "EUR";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
}

function push(event: string, ecommerce: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear the previous ecommerce object so values don't bleed between events.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });
}

export function trackViewItem(item: AnalyticsItem) {
  push("view_item", {
    currency: CURRENCY,
    value: item.price,
    items: [{ quantity: 1, ...item }],
  });
}

export function trackAddToCart(item: AnalyticsItem) {
  const quantity = item.quantity ?? 1;
  push("add_to_cart", {
    currency: CURRENCY,
    value: item.price * quantity,
    items: [{ ...item, quantity }],
  });
}

export function trackBeginCheckout(items: AnalyticsItem[]) {
  const value = items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
  push("begin_checkout", {
    currency: CURRENCY,
    value,
    items,
  });
}
