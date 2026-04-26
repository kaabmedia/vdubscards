import { defineArrayMember, defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  { title: "Star", value: "Star" },
  { title: "Users", value: "Users" },
  { title: "Shield", value: "Shield" },
  { title: "Calendar", value: "Calendar" },
  { title: "ShieldCheck", value: "ShieldCheck" },
  { title: "Heart", value: "Heart" },
  { title: "UsersRound", value: "UsersRound" },
  { title: "Trophy", value: "Trophy" },
  { title: "Package", value: "Package" },
  { title: "Truck", value: "Truck" },
  { title: "Sparkles", value: "Sparkles" },
];

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Pagina",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "stats", title: "Stats" },
    { name: "story", title: "Ons Verhaal" },
    { name: "values", title: "Waarden" },
    { name: "community", title: "Community" },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────
    defineField({
      name: "heroBadge",
      title: "Badge tekst",
      type: "string",
      group: "hero",
      initialValue: "A Family Business",
    }),
    defineField({
      name: "heroTitle",
      title: "Titel",
      type: "string",
      group: "hero",
      initialValue: "Welcome to V-Dub's",
    }),
    defineField({
      name: "heroText",
      title: "Tekst",
      type: "text",
      rows: 4,
      group: "hero",
      initialValue:
        "At V-Dub's Cards, everything revolves around our passion for sports and the thrill of collecting. What started as a hobby quickly grew into a true family business. With a deep love for sports and an eye for quality, we offer a carefully curated selection of sports cards and collectibles.",
    }),
    defineField({
      name: "heroCta1Text",
      title: "Knop 1 tekst",
      type: "string",
      group: "hero",
      initialValue: "Shop Collection",
    }),
    defineField({
      name: "heroCta1Link",
      title: "Knop 1 link",
      type: "string",
      group: "hero",
      initialValue: "/collections/all",
    }),
    defineField({
      name: "heroCta2Text",
      title: "Knop 2 tekst",
      type: "string",
      group: "hero",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "heroCta2Link",
      title: "Knop 2 link",
      type: "string",
      group: "hero",
      initialValue: "/contact",
    }),
    defineField({
      name: "heroImage",
      title: "Afbeelding",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),

    // ── Stats ─────────────────────────────────────────────
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icoon", type: "string", options: { list: ICON_OPTIONS } }),
            defineField({ name: "value", title: "Waarde", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      initialValue: [
        { _key: "s1", icon: "Star", value: "10,000+", label: "Cards in stock" },
        { _key: "s2", icon: "Users", value: "500+", label: "Happy collectors" },
        { _key: "s3", icon: "Shield", value: "100%", label: "Authentic" },
        { _key: "s4", icon: "Calendar", value: "Daily", label: "New arrivals" },
      ],
    }),

    // ── Our Story ─────────────────────────────────────────
    defineField({
      name: "storyBadge",
      title: "Badge tekst",
      type: "string",
      group: "story",
      initialValue: "Our Story",
    }),
    defineField({
      name: "storyTitle",
      title: "Titel",
      type: "string",
      group: "story",
      initialValue: "A Family United by Passion",
    }),
    defineField({
      name: "storyText",
      title: "Tekst",
      type: "text",
      rows: 5,
      group: "story",
      initialValue:
        "V-Dub's Cards was founded by a family who shares a love for sports and collecting. What began at the kitchen table, trading cards and sharing memories, has grown into a webshop where we connect with fellow collectors every day. As a family business, we value personal service, trust, and building lasting relationships with our customers. Every order is handled with care—just as if it were part of our own collection.",
    }),
    defineField({
      name: "storyCtaText",
      title: "Link tekst",
      type: "string",
      group: "story",
      initialValue: "Explore our collection",
    }),
    defineField({
      name: "storyCtaLink",
      title: "Link",
      type: "string",
      group: "story",
      initialValue: "/collections/all",
    }),
    defineField({
      name: "storyImage",
      title: "Afbeelding",
      type: "image",
      group: "story",
      options: { hotspot: true },
    }),

    // ── Values ────────────────────────────────────────────
    defineField({
      name: "valuesSectionTitle",
      title: "Sectie titel",
      type: "string",
      group: "values",
      initialValue: "Our Values",
    }),
    defineField({
      name: "valuesSectionSubtitle",
      title: "Sectie ondertitel",
      type: "string",
      group: "values",
      initialValue: "What makes V-Dub's different.",
    }),
    defineField({
      name: "values",
      title: "Waarden",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icoon", type: "string", options: { list: ICON_OPTIONS } }),
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "description", title: "Beschrijving", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      initialValue: [
        { _key: "v1", icon: "ShieldCheck", title: "Authenticity", description: "Every card is carefully verified to ensure you receive genuine, high-quality collectibles." },
        { _key: "v2", icon: "Heart", title: "Personal Service", description: "We treat every customer like family and every order with the utmost care and attention." },
        { _key: "v3", icon: "UsersRound", title: "Community", description: "We're building a community of passionate collectors who share the love for the hobby." },
      ],
    }),

    // ── Community ─────────────────────────────────────────
    defineField({
      name: "communityBadge",
      title: "Badge tekst",
      type: "string",
      group: "community",
      initialValue: "Community",
    }),
    defineField({
      name: "communityTitle",
      title: "Titel",
      type: "string",
      group: "community",
      initialValue: "For Collectors, by Collectors",
    }),
    defineField({
      name: "communityText",
      title: "Tekst",
      type: "text",
      rows: 5,
      group: "community",
      initialValue:
        "Whether you're just starting your collection or you're a seasoned hobbyist, V-Dub's Cards is your trusted destination. We stay up to date with the latest releases and proudly offer rare finds from the past. We're always happy to offer guidance, track down a specific card, or simply talk shop. V-Dub's Cards is more than a store—it's a community built on shared passion.",
    }),
    defineField({
      name: "communityCta1Text",
      title: "Knop 1 tekst",
      type: "string",
      group: "community",
      initialValue: "Start Collecting",
    }),
    defineField({
      name: "communityCta1Link",
      title: "Knop 1 link",
      type: "string",
      group: "community",
      initialValue: "/collections/all",
    }),
    defineField({
      name: "communityCta2Text",
      title: "Knop 2 tekst",
      type: "string",
      group: "community",
      initialValue: "Join Us at Events",
    }),
    defineField({
      name: "communityCta2Link",
      title: "Knop 2 link",
      type: "string",
      group: "community",
      initialValue: "/events",
    }),
  ],
});
