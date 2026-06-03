import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { getAllBlogPosts, getFeaturedPost, getBlogImageUrl, estimateReadingTimeFromChars, formatBlogDate } from "@/lib/sanity/blog";
import type { BlogPostSummary } from "@/lib/sanity/blog";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Blog | V-Dub's Cards",
  description:
    "Trading card collecting tips, market news, product reviews and guides from V-Dub's Cards. Based in the Netherlands, shipping worldwide.",
  alternates: { canonical: "https://vdubscards.com/blog" },
  openGraph: {
    title: "Blog | V-Dub's Cards",
    description:
      "Trading card collecting tips, market news, product reviews and guides from V-Dub's Cards.",
    url: "https://vdubscards.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | V-Dub's Cards",
    description: "Trading card collecting tips, market news and product reviews.",
  },
};

export const revalidate = 600;

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-foreground/80">
      <Tag className="h-3 w-3" />
      {category}
    </span>
  );
}

function PostCard({ post }: { post: BlogPostSummary }) {
  const imageUrl = getBlogImageUrl(post.mainImage, 640, 360);
  const readMins = estimateReadingTimeFromChars(post.bodyCharCount);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-4xl">🃏</span>
          </div>
        )}
        {/* Category overlay */}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-900">{post.author}</span>
            <span className="text-xs text-gray-500">{formatBlogDate(post.publishedAt)}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {readMins} min
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedHero({ post }: { post: BlogPostSummary }) {
  const imageUrl = getBlogImageUrl(post.mainImage, 1400, 700);
  const readMins = estimateReadingTimeFromChars(post.bodyCharCount);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative min-h-[420px] overflow-hidden rounded-2xl md:min-h-[520px]">
        {/* Background image */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
              <span className="text-xs text-white/70">
                {formatBlogDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/70">
                <Clock className="h-3 w-3" />
                {readMins} min read
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-snug text-white md:text-4xl">
              {post.title}
            </h2>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/80 md:text-base">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm font-medium text-white/90">{post.author}</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors group-hover:bg-primary">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Featured badge */}
        <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
          Featured
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const [featured, allPosts] = await Promise.all([
    getFeaturedPost(),
    getAllBlogPosts(),
  ]);

  const nonFeaturedPosts = allPosts.filter(
    (p) => !featured || p.slug !== featured.slug
  );

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://vdubscards.com/blog",
    name: "V-Dub's Cards Blog",
    description:
      "Trading card collecting tips, market news, product reviews and guides.",
    url: "https://vdubscards.com/blog",
    publisher: {
      "@type": "Organization",
      "@id": "https://vdubscards.com/#organization",
      name: "V-Dub's Cards",
    },
    blogPost: allPosts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://vdubscards.com/blog/${p.slug}`,
      datePublished: p.publishedAt,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
        suppressHydrationWarning
      />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Blog</h1>
          <p className="mt-2 max-w-xl text-gray-600">
            Collecting tips, market news, product reviews and guides from the V-Dub&apos;s Cards team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Featured post hero */}
        {featured && (
          <section className="mb-12">
            <FeaturedHero post={featured} />
          </section>
        )}

        {/* All posts grid */}
        {nonFeaturedPosts.length > 0 ? (
          <section>
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              {featured ? "Latest articles" : "All articles"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nonFeaturedPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        ) : (
          !featured && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <span className="text-5xl">📝</span>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No posts yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Check back soon — articles are coming.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Browse the shop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )
        )}
      </div>

      <NewsletterSection />
    </div>
  );
}
