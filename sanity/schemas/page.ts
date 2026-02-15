import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
    }),
    defineField({
      name: "body",
      title: "Inhoud",
      type: "blockContent",
    }),
  ],
});
