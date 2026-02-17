import Link from "next/link";
import { CheckCircle2, Package, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | V-Dub's Cards",
  description: "Thank you for your order. Your purchase has been confirmed.",
  robots: "noindex",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 md:text-3xl">
              Thank you for your order!
            </h1>
            <p className="mt-3 text-gray-600">
              Your payment was successful and your order has been confirmed.
            </p>
            <div className="mt-8 space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Check your email</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ve sent you an order confirmation with all the details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">What happens next?</p>
                  <p className="text-sm text-gray-600">
                    Your order will be processed within 1–2 business days. You&apos;ll receive a
                    shipping confirmation with tracking once it&apos;s on its way.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Continue shopping
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
