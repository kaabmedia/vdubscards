import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Locatie",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Startdatum",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Einddatum",
      type: "datetime",
      description: "Optioneel: laat leeg voor een eendaags event",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Optioneel: link naar eventpagina of tickets",
    }),
    defineField({
      name: "isNext",
      title: "Volgende event",
      type: "boolean",
      description: "Markeer als 'Next up' op de website",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sorteervolgorde",
      type: "number",
      description: "Lager = eerder getoond",
    }),
  ],
  orderings: [
    { title: "Sorteervolgorde", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
    { title: "Startdatum", name: "startDate", by: [{ field: "startDate", direction: "asc" }] },
  ],
  preview: {
    select: { name: "name", startDate: "startDate", endDate: "endDate", location: "location" },
    prepare({ name, startDate, endDate, location }) {
      const dateStr = startDate
        ? endDate
          ? `${new Date(startDate).toLocaleDateString("nl-NL")} – ${new Date(endDate).toLocaleDateString("nl-NL")}`
          : new Date(startDate).toLocaleDateString("nl-NL")
        : "";
      return {
        title: name ?? "Untitled",
        subtitle: [dateStr, location].filter(Boolean).join(" · "),
      };
    },
  },
});
