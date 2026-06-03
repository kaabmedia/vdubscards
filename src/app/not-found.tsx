import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | V-Dub's Cards",
  description: "This page could not be found. Browse our trading card collections.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/collections"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Browse collections
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
