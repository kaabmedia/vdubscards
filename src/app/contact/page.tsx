import { Mail, Phone, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Contact us | V-Dub's Cards",
  description:
    "Contact V-Dub's Cards. Email, phone or reach out for product questions, orders and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Contact us
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Have a question about your order, our products or need support? We
            respond quickly and are happy to help.
          </p>
        </div>

        {/* Contact options grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:Vdubscards@hotmail.com"
            className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">Email us</h2>
            <p className="mt-2 text-sm text-gray-600">
              For product questions, order updates or return requests. We typically respond within 1 business day.
            </p>
            <span className="mt-3 font-medium text-primary group-hover:underline">
              Vdubscards@hotmail.com
            </span>
          </a>

          <a
            href="tel:+31684386100"
            className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">Call us</h2>
            <p className="mt-2 text-sm text-gray-600">
              Prefer to talk to someone? Call us and we will help you right away.
            </p>
            <span className="mt-3 font-medium text-primary group-hover:underline">
              +31 6 84 38 61 00
            </span>
          </a>

          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-bold text-gray-900">Visit us</h2>
            <p className="mt-2 text-sm text-gray-600">
              Find us at events and markets across Europe. Check our{" "}
              <a href="/events" className="font-medium text-primary hover:underline">
                Events
              </a>{" "}
              section for upcoming dates.
            </p>
          </div>
        </div>

        {/* Info block */}
        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-bold text-gray-900">Response times</h2>
          <p className="mt-2 text-sm text-gray-600">
            We aim to respond to all emails within 1 business day. For urgent
            order issues, calling is often the fastest option. Our customer
            service is available during business hours (CET).
          </p>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
