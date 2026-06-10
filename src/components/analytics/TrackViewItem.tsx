"use client";

import { useEffect } from "react";
import { trackViewItem, type AnalyticsItem } from "@/lib/analytics/gtm";

// Fires a GA4 `view_item` event once when a product detail page mounts.
// Rendered from the (server) product page so the event runs client-side.
export function TrackViewItem(item: AnalyticsItem) {
  useEffect(() => {
    trackViewItem(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.item_id]);

  return null;
}
