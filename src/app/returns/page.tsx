import { RotateCcw, Clock, Tag, Gift } from "lucide-react";
import type { Metadata } from "next";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Returns & Refunds | V-Dub's Cards",
  description:
    "Returns and refunds policy for V-Dub's Cards. Learn how we process refunds, exchanges and gifts.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Returns & Refunds
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Clear and simple. Read how we process refunds, exchanges and gifts,
            and what to do if a refund is late or missing.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary px-5 py-3 text-primary-foreground">
            <RotateCcw className="h-4 w-4 shrink-0" />
            <p className="text-sm font-medium">
              Returns are inspected within 1-2 business days after receipt
            </p>
          </div>
        </div>

        {/* Policy cards in grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <h2 className="font-bold text-gray-900">Refunds</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Once we receive and inspect your return, we notify you of approval
              or rejection. If approved, a credit is applied to your original
              payment method within a certain number of days.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <h2 className="font-bold text-gray-900">Late or missing refunds</h2>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              <li>• Check your bank account again</li>
              <li>• Contact your credit card company</li>
              <li>• Contact your bank</li>
              <li>
                • Still not received?{" "}
                <a
                  href="mailto:Vdubscards@hotmail.com"
                  className="font-medium text-primary hover:underline"
                >
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-600" />
              <h2 className="font-bold text-gray-900">Sale items</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Only regular priced items may be refunded. Sale items cannot be
              refunded.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <h2 className="font-bold text-gray-900">Exchanges</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              We only replace items if they are defective or damaged. Contact us
              at{" "}
              <a
                href="mailto:Vdubscards@hotmail.com"
                className="font-medium text-primary hover:underline"
              >
                Vdubscards@hotmail.com
              </a>{" "}
              and send your item to:
            </p>
            <div className="mt-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
              Sperwerhorst 10, 2675WT Honselersdijk
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-gray-600" />
              <h2 className="font-bold text-gray-900">Gifts</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Gift marked & shipped to you: gift credit. Not marked as gift or
              shipped to giver: refund to gift giver.
            </p>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
