import Link from "next/link";
import {
  Truck,
  RotateCcw,
  CreditCard,
  Globe,
  CheckCircle,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "FAQ | V-Dub's Cards",
  description:
    "Frequently asked questions about V-Dub's Cards. Shipping, returns, payments, authenticity and more.",
};

const faqItems = [
  {
    icon: Truck,
    question: "When will my order ship?",
    answer:
      "Orders are processed within 1-2 business days. As soon as your parcel leaves our warehouse you will receive a DHL tracking link.",
  },
  {
    icon: Globe,
    question: "Do you ship internationally?",
    answer:
      "Yes. We ship within the EU and worldwide. Delivery times and any customs duties depend on your region and carrier processing.",
  },
  {
    icon: RotateCcw,
    question: "How do returns work?",
    answer: (
      <>
        You can return items that are in original condition. Start by emailing
        us with your order number; once received we inspect returns within 1-2
        business days.{" "}
        <Link href="/returns" className="font-medium text-primary hover:underline">
          Read our full returns policy
        </Link>
      </>
    ),
  },
  {
    icon: CheckCircle,
    question: "Are your products authentic?",
    answer:
      "V-dubscards only sells authentic, sealed and properly stored products sourced from trusted distributors.",
  },
  {
    icon: CreditCard,
    question: "Which payment methods are accepted?",
    answer:
      "Major cards, iDEAL, Bancontact, PayPal and Apple Pay are supported. Klarna and other regional methods are available where supported.",
  },
  {
    icon: HelpCircle,
    question: "Can I reserve items or pre-order?",
    answer:
      "For hard-to-find items or pre-orders, reach out via email. We will confirm availability and expected timelines before you pay.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Quick answers to the most common questions we hear from collectors.
            If you still need help,{" "}
            <a
              href="mailto:Vdubscards@hotmail.com"
              className="font-medium text-primary hover:underline"
            >
              contact us
            </a>{" "}
            and we will respond quickly.
          </p>
        </div>

        {/* FAQ grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
                <div>
                  <h2 className="font-bold text-gray-900">{item.question}</h2>
                  <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h2 className="font-bold text-gray-900">Email us</h2>
                <p className="mt-2 text-sm text-gray-600">
                  For product questions, order updates or return requests, email{" "}
                  <a
                    href="mailto:Vdubscards@hotmail.com"
                    className="font-medium text-primary hover:underline"
                  >
                    Vdubscards@hotmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
              <div>
                <h2 className="font-bold text-gray-900">Call us</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Prefer to talk to a person? Call{" "}
                  <a
                    href="tel:+31684386100"
                    className="font-medium text-primary hover:underline"
                  >
                    +31 6 84 38 61 00
                  </a>{" "}
                  and we will help you right away.
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
