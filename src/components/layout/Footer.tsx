import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const shopLinks = [
  { href: "/collections/all", label: "All Products" },
  { href: "/collections", label: "Collections" },
  { href: "/collections/sale", label: "On Sale" },
];

const customerLinks = [
  { href: "/shipping", label: "Shipping & Delivery" },
  { href: "/returns", label: "Returns and Refunds" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="group relative inline-block h-10 w-36 md:h-12 md:w-40">
              <Image
                src="/logo-vdubs.png"
                alt="V-Dub's Cards"
                fill
                className="object-contain object-left transition-opacity group-hover:opacity-90"
                sizes="160px"
              />
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
              Premium cards, comics &amp; collectibles.
              <br />
              Curated with care for fans and collectors.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              <a
                href="https://www.instagram.com/vdubs.sportscards/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-amber-100 hover:text-amber-600 hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61577797011657"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-amber-100 hover:text-amber-600 hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 transition-colors duration-200 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 transition-colors duration-200 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 transition-colors duration-200 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:Vdubscards@hotmail.com"
                className="flex items-center gap-2 text-[13px] text-gray-500 transition-colors duration-200 hover:text-gray-900"
              >
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Vdubscards@hotmail.com
              </a>
              <a
                href="tel:+31684386100"
                className="flex items-center gap-2 text-[13px] text-gray-500 transition-colors duration-200 hover:text-gray-900"
              >
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                +31 6 84 38 61 00
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} V-Dub&apos;s Cards. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {["VISA", "Mastercard", "Bancontact", "KBC", "iDEAL", "EPS", "PayPal"].map(
              (name) => (
                <span
                  key={name}
                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
