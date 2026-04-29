import { defineField, defineType } from "sanity";

export const termsPage = defineType({
  name: "termsPage",
  title: "Algemene Voorwaarden Pagina",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Paginatitel", type: "string", initialValue: "Terms & Conditions" }),
    defineField({ name: "lastUpdated", title: "Laatste update", type: "string", initialValue: "27 March 2024" }),
    defineField({
      name: "sections",
      title: "Secties",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "content", title: "Inhoud", type: "text", rows: 5 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});
