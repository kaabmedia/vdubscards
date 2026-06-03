import type { MetadataRoute } from "next";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  SITEMAP_PRODUCTS_QUERY,
  SITEMAP_COLLECTIONS_QUERY,
} from "@/lib/shopify/queries";
import { getAllBlogSlugs } from "@/lib/sanity/blog";

const BASE_URL = "https://vdubscards.com";

interface SitemapNode {
  handle: string;
  updatedAt: string;
}

interface SitemapResponse {
  edges: Array<{ node: SitemapNode }>;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

async function getAllProductHandles(): Promise<SitemapNode[]> {
  const results: SitemapNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const resp: { products: SitemapResponse } = await shopifyFetch<{ products: SitemapResponse }>({
        query: SITEMAP_PRODUCTS_QUERY,
        variables: { first: 250, after },
      });
      const page: SitemapResponse = resp?.products;
      if (!page?.edges?.length) break;
      results.push(...page.edges.map((e: { node: SitemapNode }) => e.node));
      hasNextPage = page.pageInfo.hasNextPage;
      after = page.pageInfo.endCursor;
    } catch {
      break;
    }
  }

  return results;
}

async function getAllCollectionHandles(): Promise<SitemapNode[]> {
  const results: SitemapNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      const resp: { collections: SitemapResponse } = await shopifyFetch<{ collections: SitemapResponse }>({
        query: SITEMAP_COLLECTIONS_QUERY,
        variables: { first: 100, after },
      });
      const page: SitemapResponse = resp?.collections;
      if (!page?.edges?.length) break;
      results.push(...page.edges.map((e: { node: SitemapNode }) => e.node));
      hasNextPage = page.pageInfo.hasNextPage;
      after = page.pageInfo.endCursor;
    } catch {
      break;
    }
  }

  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, blogSlugs] = await Promise.all([
    getAllProductHandles(),
    getAllCollectionHandles(),
    getAllBlogSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const collectionPages: MetadataRoute.Sitemap = collections
    .filter((c) => !c.handle.startsWith("hidden-") && c.handle !== "all")
    .map((c) => ({
      url: `${BASE_URL}/collections/${c.handle}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/producten/${p.handle}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt ?? b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...collectionPages, ...productPages, ...blogPages];
}
