import { sanityClient } from "./client";

export interface FaqItem { question: string; answer: string }

export interface FaqPageData {
  pageTitle: string;
  subtitle: string;
  items: FaqItem[];
}

const QUERY = `*[_type == "faqPage"][0]{ pageTitle, subtitle, items[]{ question, answer } }`;

const DEFAULTS: FaqPageData = {
  pageTitle: "Frequently Asked Questions",
  subtitle: "Quick answers to the most common questions we hear from collectors. If you still need help, contact us and we will respond quickly.",
  items: [
    { question: "When will my order ship?", answer: "Orders are processed within 1-2 business days. As soon as your parcel leaves our warehouse you will receive a DHL tracking link." },
    { question: "Where do you ship to?", answer: "We ship within the European Union, including the Netherlands. Delivery times depend on your region and carrier processing. We currently do not ship outside the EU." },
    { question: "How do returns work?", answer: "You can return items that are in original condition. Start by emailing us with your order number; once received we inspect returns within 1-2 business days." },
    { question: "Are your products authentic?", answer: "V-dubscards only sells authentic, sealed and properly stored products sourced from trusted distributors." },
    { question: "Which payment methods are accepted?", answer: "Major cards, iDEAL, Bancontact, PayPal and Apple Pay are supported. Klarna and other regional methods are available where supported." },
    { question: "Can I reserve items or pre-order?", answer: "For hard-to-find items or pre-orders, reach out via email. We will confirm availability and expected timelines before you pay." },
  ],
};

export async function getFaqPage(): Promise<FaqPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<Partial<FaqPageData> | null>(QUERY);
    if (!data) return DEFAULTS;
    return {
      pageTitle: data.pageTitle || DEFAULTS.pageTitle,
      subtitle: data.subtitle || DEFAULTS.subtitle,
      items: data.items?.length ? data.items : DEFAULTS.items,
    };
  } catch {
    return DEFAULTS;
  }
}
