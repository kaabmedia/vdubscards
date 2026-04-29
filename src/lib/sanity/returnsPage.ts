import { sanityClient } from "./client";

export interface ReturnsCard { title: string; content: string }

export interface ReturnsPageData {
  pageTitle: string;
  subtitle: string;
  highlightText: string;
  cards: ReturnsCard[];
}

const QUERY = `*[_type == "returnsPage"][0]{ pageTitle, subtitle, highlightText, cards[]{ title, content } }`;

const DEFAULTS: ReturnsPageData = {
  pageTitle: "Returns & Refunds",
  subtitle: "Clear and simple. Read how we process refunds, exchanges and gifts, and what to do if a refund is late or missing.",
  highlightText: "Returns are inspected within 1-2 business days after receipt",
  cards: [
    { title: "Refunds", content: "Once we receive and inspect your return, we notify you of approval or rejection. If approved, a credit is applied to your original payment method within a certain number of days." },
    { title: "Late or missing refunds", content: "• Check your bank account again\n• Contact your credit card company\n• Contact your bank\n• Still not received? Contact us at Vdubscards@hotmail.com" },
    { title: "Sale items", content: "Only regular priced items may be refunded. Sale items cannot be refunded." },
    { title: "Exchanges", content: "We only replace items if they are defective or damaged. Contact us at Vdubscards@hotmail.com and send your item to: Sperwerhorst 10, 2675WT Honselersdijk" },
    { title: "Gifts", content: "Gift marked & shipped to you: gift credit. Not marked as gift or shipped to giver: refund to gift giver." },
  ],
};

export async function getReturnsPage(): Promise<ReturnsPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<ReturnsPageData | null>(QUERY);
    return data ? { ...DEFAULTS, ...data } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
