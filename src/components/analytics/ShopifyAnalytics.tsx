"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  ShopifySalesChannel,
  type ShopifyPageViewPayload,
} from "@shopify/hydrogen-react";

interface ShopifyAnalyticsProps {
  shopId: string; // GID: gid://shopify/Shop/12345
}

export function ShopifyAnalytics({ shopId }: ShopifyAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!shopId) return;

    const payload: ShopifyPageViewPayload = {
      ...getClientBrowserParameters(),
      hasUserConsent: true,
      shopifySalesChannel: ShopifySalesChannel.headless,
      shopId,
      currency: "EUR",
      acceptedLanguage: "NL",
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
