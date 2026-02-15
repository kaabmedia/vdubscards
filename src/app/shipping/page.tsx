import {
  Truck,
  MapPin,
  Globe,
  Clock,
  Package,
  MapPinned,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Shipping & Delivery | V-Dub's Cards",
  description:
    "Shipping information for V-Dub's Cards. Free standard shipping on orders over €150. Ship to Netherlands, EU, and worldwide.",
};

const shippingMethods = [
  {
    region: "Netherlands",
    icon: MapPin,
    options: [
      { method: "Standard", days: "2-3 days", price: "€5.00" },
      { method: "Express", days: "1-2 days", price: "€10.00" },
    ],
  },
  {
    region: "Within EU",
    icon: Globe,
    options: [
      { method: "Standard", days: "5-7 days", price: "€7.00" },
      { method: "Express", days: "2-4 days", price: "€15.00" },
    ],
  },
  {
    region: "International",
    icon: Globe,
    options: [
      { method: "Standard", days: "7-14 days", price: "€15.00" },
      { method: "Express", days: "3-7 days", price: "€25.00" },
    ],
  },
];

const tableRows = [
  { region: "Netherlands", method: "Standard", days: "2-3 business days", carrier: "DHL", price: "€5.00" },
  { region: "Netherlands", method: "Express", days: "1-2 business days", carrier: "DHL", price: "€10.00" },
  { region: "Within EU", method: "Standard", days: "5-7 business days", carrier: "DHL", price: "€7.00" },
  { region: "Within EU", method: "Express", days: "2-4 business days", carrier: "DHL", price: "€15.00" },
  { region: "International", method: "Standard", days: "7-14 business days", carrier: "DHL", price: "€15.00" },
  { region: "International", method: "Express", days: "3-7 business days", carrier: "DHL", price: "€25.00" },
];

export default function ShippingPage() {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Shipping & Delivery
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            At V-Dub&apos;s Cards we care about getting your orders to you safely and
            on time. We ship within the EU and worldwide. Shipping costs,
            delivery times, and customs vary by region.
          </p>
          <Link
            href="/collections/all"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Truck className="h-4 w-4" />
            Free Standard Shipping on orders over €150.00
          </Link>
        </div>

        {/* Methods + Table in one grid */}
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900">Methods & Prices</h2>
            {shippingMethods.map((item) => (
              <div
                key={item.region}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{item.region}</h3>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {item.options.map((opt) => (
                    <li key={opt.method}>
                      {opt.method}: {opt.days}, {opt.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Overview</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 font-semibold text-gray-900">Region</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-900">Method</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-900">Delivery Time</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-900">Carrier</th>
                    <th className="px-4 py-2.5 font-semibold text-gray-900">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5 text-gray-700">{row.region}</td>
                      <td className="px-4 py-2.5 text-gray-700">{row.method}</td>
                      <td className="px-4 py-2.5 text-gray-700">{row.days}</td>
                      <td className="px-4 py-2.5 text-gray-700">{row.carrier}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Delivery times are estimates and may vary due to customs or carrier delays.
            </p>
          </div>
        </div>

        {/* Info cards in grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Order Processing</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Processed within 1-2 business days after payment. Weekend/holiday orders on next business day.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Packaging</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              All products carefully packaged. Cards and collectibles protected with appropriate materials.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Tracking</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Confirmation email with DHL tracking number once shipped. Track from door to door.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <MapPinned className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Address</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Ensure correct address at checkout. We are not responsible for undeliverable packages due to incorrect addresses.
            </p>
          </div>
        </div>

        {/* Bottom row: Customs, Lost/Damaged, Contact, Policy */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Customs</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              EU orders: no customs fees. International: duties/taxes may apply. Customer responsibility.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Lost or Damaged</h3>
            <p className="mt-2 text-sm text-gray-600">
              Contact us within 7 days. We work with DHL to resolve. Keep packaging for damaged items.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <p className="mt-2 text-sm text-gray-600">
              Questions?{" "}
              <a href="mailto:Vdubscards@hotmail.com" className="font-medium text-primary hover:underline">
                Vdubscards@hotmail.com
              </a>
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Policy Updates</h3>
            <p className="mt-2 text-sm text-gray-600">
              We may update this policy without notice. Changes take effect immediately. Review periodically.
            </p>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
