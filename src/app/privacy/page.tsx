import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getPrivacyPage } from "@/lib/sanity/privacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | V-Dub's Cards",
  description: "Privacy policy for V-Dub's Cards. How we collect, use and protect your personal information.",
};

export default async function PrivacyPage() {
  const data = await getPrivacyPage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.pageTitle}</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {data.lastUpdated}</p>

          <div className="mt-10 space-y-8">
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm leading-relaxed text-gray-600">{data.intro}</p>
            </section>

            {data.sections.map((section) => (
              <section key={section.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="font-bold text-gray-900">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm text-gray-600">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
