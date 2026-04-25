import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Pagina",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Koptekst",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "subheading",
      title: "Ondertitel",
      type: "text",
      rows: 3,
      initialValue:
        "Have a question about your order, our products or need support? We respond quickly and are happy to help.",
    }),
    defineField({
      name: "emailTitle",
      title: "E-mail kaart titel",
      type: "string",
      initialValue: "Email us",
    }),
    defineField({
      name: "emailDescription",
      title: "E-mail kaart beschrijving",
      type: "text",
      rows: 3,
      initialValue:
        "For product questions, order updates or return requests. We typically respond within 1 business day.",
    }),
    defineField({
      name: "emailAddress",
      title: "E-mailadres",
      type: "string",
      initialValue: "Vdubscards@hotmail.com",
    }),
    defineField({
      name: "visitTitle",
      title: "Bezoek kaart titel",
      type: "string",
      initialValue: "Visit us",
    }),
    defineField({
      name: "visitDescription",
      title: "Bezoek kaart beschrijving",
      type: "text",
      rows: 3,
      initialValue:
        "Find us at events and markets across Europe. Check our Events section for upcoming dates.",
    }),
    defineField({
      name: "responseTitle",
      title: "Reactietijd kaart titel",
      type: "string",
      initialValue: "Response times",
    }),
    defineField({
      name: "responseDescription",
      title: "Reactietijd kaart beschrijving",
      type: "text",
      rows: 3,
      initialValue:
        "We aim to respond to all emails within 1 business day. Our customer service is available during business hours (CET).",
    }),
  ],
});
