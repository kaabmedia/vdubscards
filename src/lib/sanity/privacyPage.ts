import { sanityClient } from "./client";

export interface PrivacySection { title: string; content: string }

export interface PrivacyPageData {
  pageTitle: string;
  lastUpdated: string;
  intro: string;
  sections: PrivacySection[];
}

const QUERY = `*[_type == "privacyPage"][0]{ pageTitle, lastUpdated, intro, sections[]{ title, content } }`;

const DEFAULTS: PrivacyPageData = {
  pageTitle: "Privacy Policy",
  lastUpdated: "27 March 2024",
  intro: "This Privacy Policy describes how V-Dub's Cards (\"we\", \"us\", \"our\") collects, uses, and discloses your personal information when you use our services or make purchases from our store. By using our services, you agree to the terms of this policy.",
  sections: [
    { title: "Changes to This Privacy Policy", content: "We may update this policy to reflect changes in our practices or for legal and regulatory reasons. We will notify you of any material changes by posting the updated policy on this page." },
    { title: "How We Collect and Use Your Personal Information", content: "We collect personal information over the past 12 months to provide our services, communicate with you, fulfill legal obligations, and protect our rights. Below we describe what we collect and how we use it." },
    { title: "What Personal Information We Collect", content: "Directly from you: Name, address, phone, email; Billing and shipping details; Order and payment information; Account and password; Items viewed, cart, wishlist; Customer support messages.\n\nThrough cookies: Usage data such as device info, browser, network activity via cookies, pixels and similar technologies.\n\nFrom third parties: From vendors (e.g. Shopify), payment processors, and your interactions with our emails and ads." },
    { title: "How We Use Your Personal Information", content: "Products and services: Process payments, manage orders, fulfill shipments, handle returns and exchanges.\nMarketing: Send marketing communications and tailor ads.\nSecurity: Detect and prevent fraud and malicious activity.\nCommunication: Provide support and maintain relationships." },
    { title: "Cookies", content: "We use cookies and similar technologies. Our store is powered by Shopify. You can manage cookies in your browser settings." },
    { title: "How We Disclose Personal Information", content: "We may disclose information to vendors, payment processors, business partners, with your consent, to affiliates, during transactions, to comply with law, enforce terms, or protect rights." },
    { title: "User Generated Content", content: "Content you post publicly (e.g. reviews) may be visible to anyone." },
    { title: "Third Party Websites and Links", content: "We may link to third-party websites. We are not responsible for their privacy practices. Please review their policies." },
    { title: "Children's Data", content: "Our services are not intended for children. We do not knowingly collect personal information from children." },
    { title: "Security and Retention", content: "No security measures are perfect. We retain your information as needed for our services, legal obligations, and dispute resolution." },
    { title: "Your Rights and Choices", content: "Depending on your location, you may have rights to access, delete, correct, port, restrict processing, withdraw consent, or appeal decisions. You may also manage communication preferences. To exercise these rights, contact us. We may verify your identity." },
    { title: "Complaints", content: "If you have concerns, contact us. You may also lodge a complaint with your local data protection authority." },
    { title: "International Users", content: "Your information may be transferred and processed outside your country. We use recognized mechanisms to protect your data." },
    { title: "Contact", content: "Questions or requests about this privacy policy? Contact us at Vdubscards@hotmail.com" },
  ],
};

export async function getPrivacyPage(): Promise<PrivacyPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<PrivacyPageData | null>(QUERY);
    return data ? { ...DEFAULTS, ...data } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
