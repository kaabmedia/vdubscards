import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Cancelled | V-Dub's Cards",
  description: "You left checkout. Your cart items are still saved.",
  robots: "noindex",
};

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <ShoppingCart className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 md:text-3xl">
              Checkout cancelled
            </h1>
            <p className="mt-3 text-gray-600">
              You left checkout before completing your order. Your cart items are still saved and
              waiting for you.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Ready to complete your purchase? Return to your cart to continue.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to cart
              </Link>
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
