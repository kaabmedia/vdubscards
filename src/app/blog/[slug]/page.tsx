import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, User } from "lucide-react";
import {
  getBlogPostBySlug,
  getRelatedPosts,
  getBlogImageUrl,
  estimateReadingTime,
  estimateReadingTimeFromChars,
  formatBlogDate,
} from "@/lib/sanity/blog";
import type { BlogPostSummary } from "@/lib/sanity/blog";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post not found", robots: { index: false } };

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;
  const imageUrl = getBlogImageUrl(post.mainImage, 1200, 630);

  return {
    title,
    description,
    alternates: { canonical: `https://vdubscards.com/blog/${slug}` },
    openGraph: {
      title: `${title} | V-Dub's Cards Blog`,
      description,
      url: `https://vdubscards.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: post.mainImage?.alt ?? title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

function RelatedCard({ post }: { post: BlogPostSummary }) {
  const imageUrl = getBlogImageUrl(post.mainImage, 480, 270);
  const readMins = estimateReadingTimeFromChars(post.bodyCharCount);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-3xl">🃏</span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground/80">
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
          {post.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">{formatBlogDate(post.publishedAt)}</p>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {readMins} min
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.category);
  const readMins = estimateReadingTime(post.body ?? []);
  const heroImageUrl = getBlogImageUrl(post.mainImage, 1400, 700);
  const authorImageUrl = post.authorImage
    ? urlFor(post.authorImage).width(80).height(80).fit("crop").auto("format").url()
    : null;
  const postUrl = `https://vdubscards.com/blog/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": postUrl,
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: heroImageUrl
      ? { "@type": "ImageObject", url: heroImageUrl, width: 1400, height: 700 }
      : undefined,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole ?? "Trading Card Expert",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://vdubscards.com/#organization",
      name: "V-Dub's Cards",
      logo: { "@type": "ImageObject", url: "https://vdubscards.com/logo-vdubs.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    articleSection: post.category,
    keywords: post.tags?.join(", "),
    inLanguage: "en",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vdubscards.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://vdubscards.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const faqJsonLd =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        suppressHydrationWarning
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          suppressHydrationWarning
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
            <span>/</span>
            <span className="truncate text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Post header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl">
            {/* Category + tags */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary-foreground/80">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
              {post.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold leading-snug text-gray-900 md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              {post.excerpt}
            </p>

            {/* Metadata bar */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-gray-100 pt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author}
                    width={32}
                    height={32}
                    className="rounded-full object-cover ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-4 w-4 text-primary-foreground/60" />
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-900">{post.author}</span>
                  {post.authorRole && (
                    <span className="ml-1.5 text-xs text-gray-400">· {post.authorRole}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <span className="text-xs text-gray-400">
                    (updated {formatBlogDate(post.updatedAt)})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{readMins} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {heroImageUrl && (
        <div className="container mx-auto px-4 pb-0 pt-0">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={heroImageUrl}
                alt={post.mainImage?.alt ?? post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article body */}
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {post.body && <PortableTextRenderer body={post.body} />}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <BlogFaq items={post.faq} />
          )}

          {/* All tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 border-t border-gray-200 pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author bio */}
          <div className="mt-10 flex gap-4 rounded-2xl border border-gray-200 bg-white p-6">
            {authorImageUrl ? (
              <Image
                src={authorImageUrl}
                alt={post.author}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <User className="h-6 w-6 text-primary-foreground/60" />
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900">{post.author}</p>
              {post.authorRole && (
                <p className="text-sm text-gray-500">{post.authorRole}</p>
              )}
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                Passionate about trading cards and collectibles. Based in the Netherlands, shipping worldwide.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse the shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {related.some((p) => p.category === post.category)
                    ? `More from ${post.category}`
                    : "More articles"}
                </h2>
                <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 sm:inline-flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      <NewsletterSection />
    </div>
  );
}
