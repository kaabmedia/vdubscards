import { sanityClient } from "./client";

export interface AboutStat {
  icon: string;
  value: string;
  label: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutPageData {
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroImage: { asset: { _ref: string } } | null;
  stats: AboutStat[];
  storyBadge: string;
  storyTitle: string;
  storyText: string;
  storyCtaText: string;
  storyCtaLink: string;
  storyImage: { asset: { _ref: string } } | null;
  valuesSectionTitle: string;
  valuesSectionSubtitle: string;
  values: AboutValue[];
  communityBadge: string;
  communityTitle: string;
  communityText: string;
  communityCta1Text: string;
  communityCta1Link: string;
  communityCta2Text: string;
  communityCta2Link: string;
}

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  heroBadge, heroTitle, heroText,
  heroCta1Text, heroCta1Link, heroCta2Text, heroCta2Link,
  heroImage,
  stats[] { icon, value, label },
  storyBadge, storyTitle, storyText, storyCtaText, storyCtaLink,
  storyImage,
  valuesSectionTitle, valuesSectionSubtitle,
  values[] { icon, title, description },
  communityBadge, communityTitle, communityText,
  communityCta1Text, communityCta1Link, communityCta2Text, communityCta2Link
}`;

const DEFAULTS: AboutPageData = {
  heroBadge: "A Family Business",
  heroTitle: "Welcome to V-Dub's",
  heroText:
    "At V-Dub's Cards, everything revolves around our passion for sports and the thrill of collecting. What started as a hobby quickly grew into a true family business. With a deep love for sports and an eye for quality, we offer a carefully curated selection of sports cards and collectibles.",
  heroCta1Text: "Shop Collection",
  heroCta1Link: "/collections/all",
  heroCta2Text: "Get in Touch",
  heroCta2Link: "/contact",
  heroImage: null,
  stats: [
    { icon: "Star", value: "10,000+", label: "Cards in stock" },
    { icon: "Users", value: "500+", label: "Happy collectors" },
    { icon: "Shield", value: "100%", label: "Authentic" },
    { icon: "Calendar", value: "Daily", label: "New arrivals" },
  ],
  storyBadge: "Our Story",
  storyTitle: "A Family United by Passion",
  storyText:
    "V-Dub's Cards was founded by a family who shares a love for sports and collecting. What began at the kitchen table, trading cards and sharing memories, has grown into a webshop where we connect with fellow collectors every day. As a family business, we value personal service, trust, and building lasting relationships with our customers. Every order is handled with care—just as if it were part of our own collection.",
  storyCtaText: "Explore our collection",
  storyCtaLink: "/collections/all",
  storyImage: null,
  valuesSectionTitle: "Our Values",
  valuesSectionSubtitle: "What makes V-Dub's different.",
  values: [
    { icon: "ShieldCheck", title: "Authenticity", description: "Every card is carefully verified to ensure you receive genuine, high-quality collectibles." },
    { icon: "Heart", title: "Personal Service", description: "We treat every customer like family and every order with the utmost care and attention." },
    { icon: "UsersRound", title: "Community", description: "We're building a community of passionate collectors who share the love for the hobby." },
  ],
  communityBadge: "Community",
  communityTitle: "For Collectors, by Collectors",
  communityText:
    "Whether you're just starting your collection or you're a seasoned hobbyist, V-Dub's Cards is your trusted destination. We stay up to date with the latest releases and proudly offer rare finds from the past. We're always happy to offer guidance, track down a specific card, or simply talk shop. V-Dub's Cards is more than a store—it's a community built on shared passion.",
  communityCta1Text: "Start Collecting",
  communityCta1Link: "/collections/all",
  communityCta2Text: "Join Us at Events",
  communityCta2Link: "/events",
};

export async function getAboutPage(): Promise<AboutPageData> {
  if (!sanityClient) return DEFAULTS;
  try {
    const data = await sanityClient.fetch<AboutPageData | null>(ABOUT_PAGE_QUERY);
    return data ? { ...DEFAULTS, ...data } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
