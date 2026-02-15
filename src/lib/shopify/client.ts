/**
 * Shopify Storefront API client.
 * @see https://shopify.dev/docs/api/storefront/latest
 *
 * - Supports token-based auth (X-Shopify-Storefront-Access-Token).
 * - If the request returns 401, retries without token (tokenless access).
 *   Products/Collections work without a token per Shopify docs.
 */

const SHOPIFY_STOREFRONT_API_URL =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

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
    const resWithToken = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body,
      cache: "no-store",
    });

    const jsonWithToken = await resWithToken.json().catch(() => ({}));

    if (resWithToken.ok && !jsonWithToken.errors?.length) {
      return (jsonWithToken.data ?? {}) as T;
    }

    // 401: retry tokenless (Products/Collections support tokenless access)
    if (resWithToken.status !== 401) {
      if (jsonWithToken.errors?.length) {
        throw new Error(
          jsonWithToken.errors.map((e: { message: string }) => e.message).join(", ")
        );
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
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join(", ")
    );
  }

  return (json.data ?? {}) as T;
}
