import { Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getContactPage } from "@/lib/sanity/contactPage";

export const metadata: Metadata = {
  title: "Contact us | V-Dub's Cards",
  description:
    "Contact V-Dub's Cards. Reach out by email for product questions, orders and support.",
};

export default async function ContactPage() {
  const data = await getContactPage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {data.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">{data.subheading}</p>
        </div>

        {/* Contact options grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={`mailto:${data.emailAddress}`}
            className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">{data.emailTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{data.emailDescription}</p>
            <span className="mt-3 font-medium text-primary group-hover:underline">
              {data.emailAddress}
            </span>
          </a>

          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">{data.visitTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{data.visitDescription}</p>
          </div>

          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">{data.responseTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{data.responseDescription}</p>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
