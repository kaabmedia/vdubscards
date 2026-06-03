import { defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal link",
            fields: [
              {
                name: "href",
                type: "string",
                title: "Path (e.g. /collections/soccer-cards)",
              },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Important for SEO and accessibility",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption (optional)",
        },
      ],
    },
    {
      type: "object",
      name: "callout",
      title: "Callout Box",
      fields: [
        {
          name: "type",
          type: "string",
          title: "Type",
          options: {
            list: [
              { title: "💡 Tip", value: "tip" },
              { title: "ℹ️ Info", value: "info" },
              { title: "⚠️ Warning", value: "warning" },
              { title: "✅ Success", value: "success" },
            ],
            layout: "radio",
          },
          initialValue: "tip",
        },
        {
          name: "text",
          type: "text",
          title: "Text",
          rows: 3,
        },
      ],
      preview: {
        select: { type: "type", text: "text" },
        prepare(value: Record<string, string>) {
          const icons: Record<string, string> = { tip: "💡", info: "ℹ️", warning: "⚠️", success: "✅" };
          return { title: `${icons[value.type] ?? "📌"} ${value.text?.slice(0, 60) ?? "Callout"}` };
        },
      },
    },
  ],
});
