import Link from "next/link";
import Image from "next/image";
import {
  Star, Users, Shield, Calendar, ShieldCheck, Heart,
  UsersRound, ArrowRight, Trophy, Package, Truck, Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getAboutPage } from "@/lib/sanity/aboutPage";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "About us | V-Dub's Cards",
  description:
    "V-Dub's Cards is a family business based in the Netherlands built on passion for sports cards and collectibles. Authentic products, personal service, worldwide shipping.",
  alternates: { canonical: "https://vdubscards.com/about" },
  openGraph: {
    title: "About V-Dub's Cards | Trading Card Shop Netherlands",
    description:
      "V-Dub's Cards is a family business based in the Netherlands built on passion for sports cards and collectibles. Authentic products, personal service, worldwide shipping.",
    url: "https://vdubscards.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About V-Dub's Cards",
    description: "A family business built on passion for sports cards and collectibles.",
  },
};

const ICON_MAP: Record<string, LucideIcon> = {
  Star, Users, Shield, Calendar, ShieldCheck, Heart,
  UsersRound, Trophy, Package, Truck, Sparkles,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Star;
  return <Icon className={className} />;
}

export default async function AboutPage() {
  const d = await getAboutPage();

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
                {d.heroBadge}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                {d.heroTitle}
              </h1>
              <p className="mt-6 max-w-lg text-gray-600">{d.heroText}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={d.heroCta1Link}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {d.heroCta1Text}
                </Link>
                <Link
                  href={d.heroCta2Link}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-primary/10"
                >
                  {d.heroCta2Text}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200">
              <Image
                src={d.heroImage ? urlFor(d.heroImage).width(800).url() : "/about-1.jpeg"}
                alt="V-Dub's Cards team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {d.stats.map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <DynamicIcon name={item.icon} className="h-8 w-8 text-primary" />
                <span className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  {item.value}
                </span>
                <span className="mt-1 text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-xl bg-gray-200 lg:order-1">
              <Image
                src={d.storyImage ? urlFor(d.storyImage).width(800).url() : "/about-2.jpeg"}
                alt="V-Dub's Cards family"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
                {d.storyBadge}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                {d.storyTitle}
              </h2>
              <p className="mt-6 max-w-lg text-gray-600">{d.storyText}</p>
              <Link
                href={d.storyCtaLink}
                className="mt-6 inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                {d.storyCtaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {d.valuesSectionTitle}
            </h2>
            <p className="mt-2 text-gray-600">{d.valuesSectionSubtitle}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {d.values.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-8 text-center"
              >
                <DynamicIcon name={item.icon} className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
              {d.communityBadge}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {d.communityTitle}
            </h2>
            <p className="mt-6 text-gray-600">{d.communityText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={d.communityCta1Link}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {d.communityCta1Text}
              </Link>
              <Link
                href={d.communityCta2Link}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-primary/10"
              >
                {d.communityCta2Text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
