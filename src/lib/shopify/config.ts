/**
 * Shopify store URL voor account login.
 * Gebruikt NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL indien gezet,
 * anders afgeleid van de Storefront API URL.
 */
function getShopifyAccountUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL;
  if (explicit) return explicit;

  const apiUrl = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_URL ?? "";
  if (!apiUrl) return "";

  try {
    const url = new URL(apiUrl);
    return `${url.origin}/account`;
  } catch {
    return "";
  }
}

export const SHOPIFY_ACCOUNT_URL = getShopifyAccountUrl();
