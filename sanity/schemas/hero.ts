import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Ondertitel",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Afbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ctaText",
      title: "Knoptekst",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "Knop link",
      type: "string",
    }),
  ],
});
