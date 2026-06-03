import Link from "next/link";
import { HelpCircle, Mail } from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getFaqPage } from "@/lib/sanity/faqPage";

export const metadata: Metadata = {
  title: "FAQ | V-Dub's Cards",
  description: "Frequently asked questions about V-Dub's Cards. Shipping, returns, payments, authenticity and more.",
  alternates: { canonical: "https://vdubscards.com/faq" },
};

export default async function FAQPage() {
  const data = await getFaqPage();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.pageTitle}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{data.subtitle}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {data.items.map((item) => (
            <div key={item.question} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                <div>
                  <h2 className="font-bold text-gray-900">{item.question}</h2>
                  <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h2 className="font-bold text-gray-900">Email us</h2>
                <p className="mt-2 text-sm text-gray-600">
                  For product questions, order updates or return requests, email{" "}
                  <a href="mailto:Vdubscards@hotmail.com" className="font-medium text-primary hover:underline">
                    Vdubscards@hotmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h2 className="font-bold text-gray-900">Need more help?</h2>
                <p className="mt-2 text-sm text-gray-600">
                  For extra support, visit our{" "}
                  <Link href="/contact" className="font-medium text-primary hover:underline">
                    contact page
                  </Link>{" "}
                  and we will get back to you quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
