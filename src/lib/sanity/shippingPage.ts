import { sanityClient } from "./client";

export interface ShippingOption { method: string; days: string; price: string }
export interface ShippingMethod { region: string; options: ShippingOption[] }
export interface ShippingTableRow { region: string; method: string; days: string; carrier: string; price: string }
export interface ShippingInfoCard { title: string; content: string }

export interface ShippingPageData {
  pageTitle: string;
  subtitle: string;
  freeShippingText: string;
  shippingMethods: ShippingMethod[];
  tableRows: ShippingTableRow[];
  tableDisclaimer: string;
  infoCards: ShippingInfoCard[];
}

const QUERY = `*[_type == "shippingPage"][0]{
  pageTitle, subtitle, freeShippingText,
  shippingMethods[]{ region, options[]{ method, days, price } },
  tableRows[]{ region, method, days, carrier, price },
  tableDisclaimer,
  infoCards[]{ title, content }
}`;

const DEFAULTS: ShippingPageData = {
  pageTitle: "Shipping & Delivery",
  subtitle: "At V-Dub's Cards we care about getting your orders to you safely and on time. We ship within the EU. Shipping costs and delivery times vary by region.",
  freeShippingText: "Free Standard Shipping on orders over €125.00",
  shippingMethods: [
    { region: "Netherlands", options: [{ method: "Standard", days: "2-3 days", price: "€5.00" }, { method: "Express", days: "1-2 days", price: "€10.00" }] },
    { region: "Within EU", options: [{ method: "Standard", days: "5-7 days", price: "€7.00" }, { method: "Express", days: "2-4 days", price: "€15.00" }] },
  ],
  tableRows: [
    { region: "Netherlands", method: "Standard", days: "2-3 business days", carrier: "DHL", price: "€5.00" },
    { region: "Netherlands", method: "Express", days: "1-2 business days", carrier: "DHL", price: "€10.00" },
    { region: "Within EU", method: "Standard", days: "5-7 business days", carrier: "DHL", price: "€7.00" },
    { region: "Within EU", method: "Express", days: "2-4 business days", carrier: "DHL", price: "€15.00" },
  ],
  tableDisclaimer: "Delivery times are estimates and may vary due to customs or carrier delays.",
  infoCards: [
    { title: "Order Processing", content: "Processed within 1-2 business days after payment. Weekend/holiday orders on next business day." },
    { title: "Packaging", content: "All products carefully packaged. Cards and collectibles protected with appropriate materials." },
    { title: "Tracking", content: "Confirmation email with DHL tracking number once shipped. Track from door to door." },
    { title: "Address", content: "Ensure correct address at checkout. We are not responsible for undeliverable packages due to incorrect addresses." },
    { title: "Customs", content: "EU orders: no customs fees. All orders ship within the European Union." },
    { title: "Lost or Damaged", content: "Contact us within 7 days. We work with DHL to resolve. Keep packaging for damaged items." },
    { title: "Contact", content: "Questions? Email Vdubscards@hotmail.com" },
    { title: "Policy Updates", content: "We may update this policy without notice. Changes take effect immediately. Review periodically." },
  ],
};

export async function getShippingPage(): Promise<ShippingPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<Partial<ShippingPageData> | null>(QUERY);
    if (!data) return DEFAULTS;
    return {
      pageTitle: data.pageTitle || DEFAULTS.pageTitle,
      subtitle: data.subtitle || DEFAULTS.subtitle,
      freeShippingText: data.freeShippingText || DEFAULTS.freeShippingText,
      shippingMethods: data.shippingMethods?.length ? data.shippingMethods : DEFAULTS.shippingMethods,
      tableRows: data.tableRows?.length ? data.tableRows : DEFAULTS.tableRows,
      tableDisclaimer: data.tableDisclaimer || DEFAULTS.tableDisclaimer,
      infoCards: data.infoCards?.length ? data.infoCards : DEFAULTS.infoCards,
    };
  } catch {
    return DEFAULTS;
  }
}
