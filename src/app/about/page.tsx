import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Users,
  Shield,
  Calendar,
  ShieldCheck,
  Heart,
  UsersRound,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "About us | V-Dub's Cards",
  description:
    "V-Dub's Cards - A family business built on passion for sports cards and collectibles. Authentic, personal service, community.",
};

const stats = [
  { icon: Star, value: "10,000+", label: "Cards in stock" },
  { icon: Users, value: "500+", label: "Happy collectors" },
  { icon: Shield, value: "100%", label: "Authentic" },
  { icon: Calendar, value: "Daily", label: "New arrivals" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Authenticity",
    description: "Every card is carefully verified to ensure you receive genuine, high-quality collectibles.",
  },
  {
    icon: Heart,
    title: "Personal Service",
    description: "We treat every customer like family and every order with the utmost care and attention.",
  },
  {
    icon: UsersRound,
    title: "Community",
    description: "We're building a community of passionate collectors who share the love for the hobby.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
                A Family Business
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                Welcome to V-Dub&apos;s
              </h1>
              <p className="mt-6 max-w-lg text-gray-600">
                At V-Dub&apos;s Cards, everything revolves around our passion for
                sports and the thrill of collecting. What started as a hobby
                quickly grew into a true family business. With a deep love for
                sports and an eye for quality, we offer a carefully curated
                selection of sports cards and collectibles.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-primary/10"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
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
            {stats.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center"
              >
                <item.icon className="h-8 w-8 text-primary" />
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
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                alt="V-Dub's Cards family"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
                Our Story
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                A Family United by Passion
              </h2>
              <p className="mt-6 max-w-lg text-gray-600">
                V-Dub&apos;s Cards was founded by a family who shares a love for
                sports and collecting. What began at the kitchen table, trading
                cards and sharing memories, has grown into a webshop where we
                connect with fellow collectors every day. As a family business,
                we value personal service, trust, and building lasting
                relationships with our customers. Every order is handled with
                care—just as if it were part of our own collection.
              </p>
              <Link
                href="/collections/all"
                className="mt-6 inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                Explore our collection
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
              Our Values
            </h2>
            <p className="mt-2 text-gray-600">
              What makes V-Dub&apos;s different.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-8 text-center"
              >
                <item.icon className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Collectors, by Collectors */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-gray-900">
              Community
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              For Collectors, by Collectors
            </h2>
            <p className="mt-6 text-gray-600">
              Whether you&apos;re just starting your collection or you&apos;re a
              seasoned hobbyist, V-Dub&apos;s Cards is your trusted destination. We
              stay up to date with the latest releases and proudly offer rare
              finds from the past. We&apos;re always happy to offer guidance,
              track down a specific card, or simply talk shop. V-Dub&apos;s Cards
              is more than a store—it&apos;s a community built on shared passion.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start Collecting
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-primary/10"
              >
                Join Us at Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
