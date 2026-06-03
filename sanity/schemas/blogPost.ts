import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on cards and used as meta description (max 160 characters)",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "mainImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Required for SEO and accessibility",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      validation: (Rule) => Rule.required(),
      description: "Can't find the right category? Create one under Blog Categories first.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Panini Prizm, Topps Chrome, rookie cards",
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description: "Pin as hero at the top of the blog page",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      description: "Leave empty if not updated after first publish",
    }),
    defineField({
      name: "author",
      title: "Author name",
      type: "string",
      initialValue: "V-Dub's Cards",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role",
      type: "string",
      initialValue: "Trading Card Expert",
    }),
    defineField({
      name: "authorImage",
      title: "Author photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      description:
        "Optional FAQ section shown at the end of the article. Automatically adds FAQ structured data (schema.org) for Google and AI search engines.",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "Question & Answer",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { question: "question" },
            prepare(value: Record<string, unknown>) {
              return { title: `❓ ${(value.question as string) ?? "Question"}` };
            },
          },
        },
      ],
      group: "content",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title (optional override)",
      type: "string",
      description: "Leave empty to use the post title",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description (optional override)",
      type: "text",
      rows: 2,
      description: "Leave empty to use the excerpt",
      group: "seo",
    }),
  ],
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  orderings: [
    {
      title: "Published: newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "mainImage",
      publishedAt: "publishedAt",
      featured: "featured",
    },
    prepare(value: Record<string, unknown>) {
      const date = value.publishedAt
        ? new Date(value.publishedAt as string).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "No date";
      return {
        title: `${value.featured ? "⭐ " : ""}${(value.title as string) ?? "Untitled"}`,
        subtitle: `${(value.author as string) ?? "Unknown"} · ${date}`,
      };
    },
  },
});
