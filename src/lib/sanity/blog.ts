import { sanityClient } from "./client";
import { urlFor } from "./image";
import type { PortableTextBlock } from "@portabletext/react";

export interface BlogImage {
  asset: { _ref: string };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
}

export interface FaqItem {
  _key: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: BlogImage;
  category: string;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorRole?: string;
  authorImage?: { asset: { _ref: string } };
  featured?: boolean;
  bodyCharCount?: number;
  body?: PortableTextBlock[];
  faq?: FaqItem[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPostSummary
  extends Omit<BlogPost, "body" | "faq" | "seoTitle" | "seoDescription" | "authorImage"> {}

const POST_SUMMARY_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage { ..., "alt": alt },
  "category": category->title,
  tags,
  publishedAt,
  updatedAt,
  author,
  authorRole,
  featured,
  "bodyCharCount": length(pt::text(body))
`;

const ALL_POSTS_QUERY = `
  *[_type == "blogPost"] | order(featured desc, publishedAt desc) {
    ${POST_SUMMARY_FIELDS}
  }
`;

const FEATURED_POST_QUERY = `
  *[_type == "blogPost" && featured == true] | order(publishedAt desc) [0] {
    ${POST_SUMMARY_FIELDS}
  }
`;

const POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${POST_SUMMARY_FIELDS},
    authorImage,
    body,
    faq[] { _key, question, answer },
    seoTitle,
    seoDescription
  }
`;

const ALL_SLUGS_QUERY = `
  *[_type == "blogPost"] { "slug": slug.current, publishedAt, updatedAt }
`;

const SAME_CATEGORY_QUERY = `
  *[_type == "blogPost" && slug.current != $slug && category->title == $category] | order(publishedAt desc) [0...3] {
    ${POST_SUMMARY_FIELDS}
  }
`;

const RECENT_POSTS_QUERY = `
  *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...3] {
    ${POST_SUMMARY_FIELDS}
  }
`;

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  if (!sanityClient) return [];
  try {
    return await sanityClient.fetch<BlogPostSummary[]>(ALL_POSTS_QUERY);
  } catch {
    return [];
  }
}

export async function getFeaturedPost(): Promise<BlogPostSummary | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<BlogPostSummary | null>(FEATURED_POST_QUERY);
  } catch {
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug });
  } catch {
    return null;
  }
}

export async function getAllBlogSlugs(): Promise<
  Array<{ slug: string; publishedAt: string; updatedAt?: string }>
> {
  if (!sanityClient) return [];
  try {
    return await sanityClient.fetch(ALL_SLUGS_QUERY);
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  slug: string,
  category: string
): Promise<BlogPostSummary[]> {
  if (!sanityClient) return [];
  try {
    const same = await sanityClient.fetch<BlogPostSummary[]>(SAME_CATEGORY_QUERY, {
      slug,
      category,
    });

    if (same.length >= 3) return same;

    // Not enough same-category posts — fill up with recent posts from any category
    const recent = await sanityClient.fetch<BlogPostSummary[]>(RECENT_POSTS_QUERY, { slug });
    const existingIds = new Set(same.map((p) => p._id));
    const filler = recent.filter((p) => !existingIds.has(p._id));

    return [...same, ...filler].slice(0, 3);
  } catch {
    return [];
  }
}

export function getBlogImageUrl(
  image: BlogImage,
  width = 800,
  height = 450
): string {
  try {
    return urlFor(image).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return "";
  }
}

export function estimateReadingTime(body: PortableTextBlock[]): number {
  if (!body?.length) return 1;
  const text = body
    .filter((b) => b._type === "block")
    .map((b) =>
      ((b as { children?: Array<{ text?: string }> }).children ?? [])
        .map((c) => c.text ?? "")
        .join(" ")
    )
    .join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Used on overview pages where only char count (from GROQ pt::text) is available.
// ~5 chars per word, 200 words per minute → ~1000 chars per minute.
export function estimateReadingTimeFromChars(charCount?: number): number {
  if (!charCount) return 1;
  return Math.max(1, Math.ceil(charCount / 1000));
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
