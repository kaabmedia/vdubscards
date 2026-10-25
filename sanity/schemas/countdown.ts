import { defineField, defineType } from "sanity";

export const countdown = defineType({
  name: "countdown",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "heroFloatingCardsSource",
      title: "Hero floating kaarten bron",
      type: "string",
      options: {
        list: [
          { value: "custom", title: "Eigen afbeeldingen" },
          { value: "products", title: "Willekeurige producten" },
        ],
        layout: "radio",
      },
      description: "Eigen afbeeldingen: kies handmatig. Willekeurige producten: 4 random productfoto's, klikbaar naar product.",
      initialValue: "custom",
    }),
    defineField({
      name: "heroFloatingCards",
      title: "Hero floating kaarten",
      type: "array",
      description: "4 afbeeldingen voor de zwevende kaarten in de hero (max 4). Alleen bij bron 'Eigen afbeeldingen'.",
      validation: (Rule) => Rule.max(4),
      hidden: ({ parent }) => parent?.heroFloatingCardsSource !== "custom",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt-tekst",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "enabled",
      title: "Countdown Hero tonen",
      type: "boolean",
      description: "Aan: countdown hero vervangt de standaard hero. Uit: normale hero.",
      initialValue: false,
    }),
    defineField({
      name: "endDate",
      title: "Einddatum & tijd",
      type: "datetime",
      description: "Wanneer de countdown eindigt",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "headline",
      title: "Titel",
      type: "string",
      description: "Bijv. Exclusive drop incoming",
      initialValue: "Exclusive drop incoming",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "description",
      title: "Beschrijving",
      type: "text",
      description: "Bijv. Get notified when the new cards go live...",
      initialValue: "Get notified when the new cards go live and be the first to grab them.",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "backgroundMobile",
      title: "Achtergrond Mobiel",
      type: "image",
      options: { hotspot: true },
      description: "Achtergrondafbeelding voor mobiele schermen (< 768px)",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "backgroundTablet",
      title: "Achtergrond Tablet",
      type: "image",
      options: { hotspot: true },
      description: "Achtergrondafbeelding voor tablets (768px - 1024px)",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "backgroundDesktop",
      title: "Achtergrond Desktop",
      type: "image",
      options: { hotspot: true },
      description: "Achtergrondafbeelding voor desktop (> 1024px)",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "newDropEnabled",
      title: "New Drop sectie tonen",
      type: "boolean",
      description: "Aan: toont een sectie onder de hero met afbeelding, tekst en button",
      initialValue: false,
    }),
    defineField({
      name: "newDropImage",
      title: "Afbeelding",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => !parent?.newDropEnabled,
    }),
    defineField({
      name: "newDropTitle",
      title: "Titel",
      type: "string",
      description: "Bijv. New Drop",
      hidden: ({ parent }) => !parent?.newDropEnabled,
    }),
    defineField({
      name: "newDropText",
      title: "Tekst",
      type: "text",
      description: "Beschrijvende tekst",
      hidden: ({ parent }) => !parent?.newDropEnabled,
    }),
    defineField({
      name: "newDropButtonText",
      title: "Knoptekst",
      type: "string",
      description: "Bijv. Shop now",
      hidden: ({ parent }) => !parent?.newDropEnabled,
    }),
    defineField({
      name: "newDropButtonLink",
      title: "Knop link",
      type: "string",
      description: "Bijv. /collections/new-drop",
      hidden: ({ parent }) => !parent?.newDropEnabled,
    }),
    defineField({
      name: "suppliesEnabled",
      title: "Supplies sectie tonen",
      type: "boolean",
      description: "Aan: toont onder 'Popular right now' een blok dat de supplies promoot, met de supplies-producten en een knop",
      initialValue: true,
    }),
    defineField({
      name: "suppliesImage",
      title: "Supplies afbeelding",
      type: "image",
      options: { hotspot: true },
      description: "Optioneel. Zonder afbeelding worden de productfoto's uit de supplies-collectie getoond.",
      hidden: ({ parent }) => parent?.suppliesEnabled === false,
    }),
    defineField({
      name: "suppliesTitle",
      title: "Supplies titel",
      type: "string",
      description: "Bijv. Protect your cards",
      hidden: ({ parent }) => parent?.suppliesEnabled === false,
    }),
    defineField({
      name: "suppliesText",
      title: "Supplies tekst",
      type: "text",
      description: "Korte wervende tekst naast de afbeelding",
      hidden: ({ parent }) => parent?.suppliesEnabled === false,
    }),
    defineField({
      name: "suppliesButtonText",
      title: "Supplies knoptekst",
      type: "string",
      description: "Bijv. Shop all supplies",
      hidden: ({ parent }) => parent?.suppliesEnabled === false,
    }),
    defineField({
      name: "suppliesButtonLink",
      title: "Supplies knop link",
      type: "string",
      description: "Bijv. /collections/supplies. De producten in het blok komen uit deze collectie.",
      hidden: ({ parent }) => parent?.suppliesEnabled === false,
    }),
    defineField({
      name: "eventsSliderImages",
      title: "Events sectie foto slider",
      type: "array",
      description: "Foto's voor de slider boven de events sectie op de homepage",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt-tekst",
              description: "Beschrijving voor toegankelijkheid",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { enabled: "enabled", endDate: "endDate" },
    prepare({ enabled, endDate }) {
      return {
        title: "Home",
        subtitle: enabled
          ? endDate
            ? `Actief tot ${new Date(endDate).toLocaleString("nl-NL")}`
            : "Actief (geen einddatum)"
          : "Uit",
      };
    },
  },
});
