import { defineField, defineType } from "sanity";

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy Pagina",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Paginatitel", type: "string", initialValue: "Privacy Policy" }),
    defineField({ name: "lastUpdated", title: "Laatste update", type: "string", initialValue: "27 March 2024" }),
    defineField({ name: "intro", title: "Introductie tekst", type: "text", rows: 4, initialValue: "This Privacy Policy describes how V-Dub's Cards (\"we\", \"us\", \"our\") collects, uses, and discloses your personal information when you use our services or make purchases from our store. By using our services, you agree to the terms of this policy." }),
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
