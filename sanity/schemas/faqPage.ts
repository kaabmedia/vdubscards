import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Pagina",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Paginatitel", type: "string", initialValue: "Frequently Asked Questions" }),
    defineField({ name: "subtitle", title: "Ondertitel", type: "text", rows: 3, initialValue: "Quick answers to the most common questions we hear from collectors. If you still need help, contact us and we will respond quickly." }),
    defineField({
      name: "items",
      title: "Vragen & Antwoorden",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Vraag", type: "string" }),
            defineField({ name: "answer", title: "Antwoord", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
  ],
});
