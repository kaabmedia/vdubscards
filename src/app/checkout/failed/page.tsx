import Link from "next/link";
import { XCircle, RefreshCw, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed | V-Dub's Cards",
  description: "Your payment could not be completed. Please try again or use a different payment method.",
  robots: "noindex",
};

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 md:text-3xl">
              Payment failed
            </h1>
            <p className="mt-3 text-gray-600">
              We couldn&apos;t complete your payment. This can happen if your card was declined,
              insufficient funds, or a temporary processing error.
            </p>
            <div className="mt-8 space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-6 text-left">
              <div className="flex items-start gap-3">
                <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Try again</p>
                  <p className="text-sm text-gray-600">
                    Return to your cart and attempt checkout again. You can also try a different
                    payment method or card.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Need help?</p>
                  <p className="text-sm text-gray-600">
                    Contact your bank if the problem persists, or reach out to us at{" "}
                    <a
                      href="mailto:Vdubscards@hotmail.com"
                      className="font-medium text-primary hover:underline"
                    >
                      Vdubscards@hotmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Back to cart
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
