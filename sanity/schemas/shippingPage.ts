import { defineField, defineType } from "sanity";

export const shippingPage = defineType({
  name: "shippingPage",
  title: "Verzending Pagina",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Paginatitel", type: "string", initialValue: "Shipping & Delivery" }),
    defineField({ name: "subtitle", title: "Ondertitel", type: "text", rows: 3, initialValue: "At V-Dub's Cards we care about getting your orders to you safely and on time. We ship within the EU and worldwide. Shipping costs, delivery times, and customs vary by region." }),
    defineField({ name: "freeShippingText", title: "Gratis verzending banner tekst", type: "string", initialValue: "Free Standard Shipping on orders over €125.00" }),
    defineField({
      name: "shippingMethods",
      title: "Verzendmethoden (kaarten)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "region", title: "Regio", type: "string" }),
            defineField({
              name: "options",
              title: "Opties",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "method", title: "Methode", type: "string" }),
                    defineField({ name: "days", title: "Levertijd", type: "string" }),
                    defineField({ name: "price", title: "Prijs", type: "string" }),
                  ],
                  preview: { select: { title: "method", subtitle: "price" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "region" } },
        },
      ],
    }),
    defineField({
      name: "tableRows",
      title: "Overzichtstabel rijen",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "region", title: "Regio", type: "string" }),
            defineField({ name: "method", title: "Methode", type: "string" }),
            defineField({ name: "days", title: "Levertijd", type: "string" }),
            defineField({ name: "carrier", title: "Vervoerder", type: "string" }),
            defineField({ name: "price", title: "Prijs", type: "string" }),
          ],
          preview: { select: { title: "region", subtitle: "method" } },
        },
      ],
    }),
    defineField({ name: "tableDisclaimer", title: "Tabel disclaimer", type: "string", initialValue: "Delivery times are estimates and may vary due to customs or carrier delays." }),
    defineField({
      name: "infoCards",
      title: "Informatie kaarten",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "content", title: "Inhoud", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});
