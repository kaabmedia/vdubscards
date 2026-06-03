import { Truck, MapPin, Globe, Clock, Package, MapPinned } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { getShippingPage } from "@/lib/sanity/shippingPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery | V-Dub's Cards",
  description: "Shipping information for V-Dub's Cards. Free standard shipping on orders over €125. Ships to Netherlands, EU, and worldwide via DHL with tracking.",
  alternates: { canonical: "https://vdubscards.com/shipping" },
  openGraph: {
    title: "Shipping & Delivery | V-Dub's Cards",
    description: "Free shipping on orders over €125. Ships to Netherlands, EU, and worldwide.",
    url: "https://vdubscards.com/shipping",
    type: "website",
  },
  twitter: { card: "summary", title: "Shipping & Delivery | V-Dub's Cards", description: "Free shipping over €125. Ships worldwide." },
};

const REGION_ICONS: Record<string, React.ElementType> = {
  Netherlands: MapPin,
  "Within EU": Globe,
  International: Globe,
};

const INFO_ICONS: Record<string, React.ElementType> = {
  "Order Processing": Clock,
  Packaging: Package,
  Tracking: Truck,
  Address: MapPinned,
  Customs: Globe,
};

export default async function ShippingPage() {
  const data = await getShippingPage();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.pageTitle}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{data.subtitle}</p>
          <Link
            href="/collections/all"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Truck className="h-4 w-4" />
            {data.freeShippingText}
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900">Methods & Prices</h2>
            {data.shippingMethods.map((item) => {
              const Icon = REGION_ICONS[item.region] ?? Globe;
              return (
                <div key={item.region} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{item.region}</h3>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {item.options.map((opt) => (
                      <li key={opt.method}>{opt.method}: {opt.days}, {opt.price}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
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
                  {data.tableRows.map((row, i) => (
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
            <p className="mt-3 text-xs text-gray-500">{data.tableDisclaimer}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.infoCards.map((card) => {
            const Icon = INFO_ICONS[card.title] ?? Truck;
            return (
              <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{card.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
