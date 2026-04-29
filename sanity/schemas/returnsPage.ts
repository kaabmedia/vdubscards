import { defineField, defineType } from "sanity";

export const returnsPage = defineType({
  name: "returnsPage",
  title: "Retouren Pagina",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Paginatitel", type: "string", initialValue: "Returns & Refunds" }),
    defineField({ name: "subtitle", title: "Ondertitel", type: "text", rows: 2, initialValue: "Clear and simple. Read how we process refunds, exchanges and gifts, and what to do if a refund is late or missing." }),
    defineField({ name: "highlightText", title: "Banner tekst", type: "string", initialValue: "Returns are inspected within 1-2 business days after receipt" }),
    defineField({
      name: "cards",
      title: "Beleidskaarten",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "content", title: "Inhoud", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});
