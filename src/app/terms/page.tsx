import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getTermsPage } from "@/lib/sanity/termsPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | V-Dub's Cards",
  description: "Terms and conditions for V-Dub's Cards. Rules for using our store and services.",
};

export default async function TermsPage() {
  const data = await getTermsPage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.pageTitle}</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {data.lastUpdated}</p>

          <div className="mt-10 space-y-6">
            {data.sections.map((section) => (
              <section key={section.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="font-bold text-gray-900">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
