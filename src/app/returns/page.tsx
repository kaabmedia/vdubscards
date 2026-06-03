import { RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getReturnsPage } from "@/lib/sanity/returnsPage";

export const metadata: Metadata = {
  title: "Returns & Refunds | V-Dub's Cards",
  description: "14-day return policy at V-Dub's Cards. Learn how we process returns, refunds and exchanges for trading cards and collectibles.",
  alternates: { canonical: "https://vdubscards.com/returns" },
  openGraph: {
    title: "Returns & Refunds | V-Dub's Cards",
    description: "14-day return policy. Learn how we process returns and refunds.",
    url: "https://vdubscards.com/returns",
    type: "website",
  },
  twitter: { card: "summary", title: "Returns & Refunds | V-Dub's Cards", description: "14-day return policy for trading cards." },
};

export default async function ReturnsPage() {
  const data = await getReturnsPage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.pageTitle}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{data.subtitle}</p>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary px-5 py-3 text-primary-foreground">
            <RotateCcw className="h-4 w-4 shrink-0" />
            <p className="text-sm font-medium">{data.highlightText}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => (
            <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="font-bold text-gray-900">{card.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm text-gray-600">{card.content}</p>
            </div>
          ))}
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
