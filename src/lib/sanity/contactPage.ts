import { sanityClient } from "./client";

export interface ContactPageData {
  heading: string;
  subheading: string;
  emailTitle: string;
  emailDescription: string;
  emailAddress: string;
  visitTitle: string;
  visitDescription: string;
  responseTitle: string;
  responseDescription: string;
}

const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0] {
  heading,
  subheading,
  emailTitle,
  emailDescription,
  emailAddress,
  visitTitle,
  visitDescription,
  responseTitle,
  responseDescription
}`;

const DEFAULTS: ContactPageData = {
  heading: "Contact us",
  subheading:
    "Have a question about your order, our products or need support? We respond quickly and are happy to help.",
  emailTitle: "Email us",
  emailDescription:
    "For product questions, order updates or return requests. We typically respond within 1 business day.",
  emailAddress: "Vdubscards@hotmail.com",
  visitTitle: "Visit us",
  visitDescription:
    "Find us at events and markets across Europe. Check our Events section for upcoming dates.",
  responseTitle: "Response times",
  responseDescription:
    "We aim to respond to all emails within 1 business day. Our customer service is available during business hours (CET).",
};

export async function getContactPage(): Promise<ContactPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<ContactPageData | null>(CONTACT_PAGE_QUERY);
    return data ? { ...DEFAULTS, ...data } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
