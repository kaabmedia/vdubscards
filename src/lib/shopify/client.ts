/**
 * Shopify Storefront API client.
 * @see https://shopify.dev/docs/api/storefront/latest
 * @see https://shopify.dev/api/usage/authentication#access-tokens-for-the-storefront-api
 *
 * - Private token (shpat_...): gebruik Shopify-Storefront-Private-Token header
 * - Public token: gebruik X-Shopify-Storefront-Access-Token header
 */

const SHOPIFY_STOREFRONT_API_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

function getTokenHeader(): Record<string, string> {
  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) return {};
  const token = SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  // Private tokens (Headless channel) gebruiken Shopify-Storefront-Private-Token
  if (token.startsWith("shpat_")) {
    return { "Shopify-Storefront-Private-Token": token };
  }
  return { "X-Shopify-Storefront-Access-Token": token };
}

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!SHOPIFY_STOREFRONT_API_URL) {
    return {} as T;
  }

  const body = JSON.stringify({ query, variables });

  // Try with token first if we have one
  if (SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    const tokenHeaders = getTokenHeader();
    const resWithToken = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...tokenHeaders,
      },
      body,
      cache: "no-store",
    });

    const jsonWithToken = await resWithToken.json().catch(() => ({}));

    if (resWithToken.ok && !jsonWithToken.errors?.length) {
      return (jsonWithToken.data ?? {}) as T;
    }

    // quantityAvailable scope missing: retry without that field (fallback)
    const errMsg = jsonWithToken.errors?.map((e: { message: string }) => e.message).join(", ") ?? "";
    if (
      jsonWithToken.errors?.length &&
      errMsg.includes("quantityAvailable") &&
      errMsg.includes("unauthenticated_read_product_inventory")
    ) {
      const fallbackQuery = query.replace(/\s*quantityAvailable\s*/g, " ");
      return shopifyFetch<T>({ query: fallbackQuery, variables });
    }

    // 401: retry tokenless (Products/Collections support tokenless access)
    if (resWithToken.status !== 401) {
      if (jsonWithToken.errors?.length) {
        throw new Error(errMsg || "Shopify API error");
      }
      throw new Error(`Shopify API error: ${resWithToken.status} ${resWithToken.statusText}`);
    }
  }

  // Tokenless request (no header)
  const res = await fetch(SHOPIFY_STOREFRONT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (json.errors?.length) {
      throw new Error(
        json.errors.map((e: { message: string }) => e.message).join(", ")
      );
    }
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  if (json.errors?.length) {
    const errMsg = json.errors.map((e: { message: string }) => e.message).join(", ");
    if (
      errMsg.includes("quantityAvailable") &&
      errMsg.includes("unauthenticated_read_product_inventory")
    ) {
      const fallbackQuery = query.replace(/\s*quantityAvailable\s*/g, " ");
      return shopifyFetch<T>({ query: fallbackQuery, variables });
    }
    throw new Error(errMsg);
  }

  return (json.data ?? {}) as T;
}
