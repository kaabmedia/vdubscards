"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import type { NavLink } from "@/lib/shopify/menu";

/* ─────────────────────────── Mobile nav ────────────────────────── */

function MobileNavItem({
  link,
  onNavigate,
  depth,
}: {
  link: NavLink;
  onNavigate: () => void;
  depth: number;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = link.children && link.children.length > 0;
  const paddingLeft = 12 + depth * 16;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={link.href}
          className="flex-1 rounded-lg py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          style={{ paddingLeft: `${paddingLeft}px`, paddingRight: "8px" }}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`${open ? "Sluit" : "Open"} submenu ${link.label}`}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      {/* Children – animated slide */}
      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-200 ${
            open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {link.children!.map((child) => (
            <MobileNavItem
              key={child.href + child.label}
              link={child}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Desktop flyout item ───────────────────── */

function DesktopFlyoutItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const hasChildren = link.children && link.children.length > 0;

  const handleEnter = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

  if (!hasChildren) {
    return (
      <Link
        href={link.href}
        className="block whitespace-nowrap px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-purple"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={link.href}
        className="flex items-center justify-between gap-4 whitespace-nowrap px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-purple"
      >
        {link.label}
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      </Link>

      {/* Sub-flyout */}
      <div
        className={`absolute left-full top-0 z-[999] pl-1 transition-all duration-200 ${
          open
            ? "visible translate-x-0 opacity-100"
            : "invisible -translate-x-1 opacity-0"
        }`}
      >
        <div className="min-w-[200px] rounded-xl border border-border/60 bg-white py-1.5 shadow-dropdown">
          {link.children!.map((child) => (
            <DesktopFlyoutItem
              key={child.href + child.label}
              link={child}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Desktop top-level nav item ────────────────── */

function DesktopTopNavItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const hasChildren = link.children && link.children.length > 0;

  const handleEnter = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => () => clearTimeout(closeTimeout.current), []);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={hasChildren ? handleEnter : undefined}
      onMouseLeave={hasChildren ? handleLeave : undefined}
    >
      <Link
        href={link.href}
        className="group relative inline-flex items-center gap-1 py-1 text-sm font-medium text-foreground transition-colors hover:text-foreground"
      >
        {link.label}
        {hasChildren && (
          <ChevronDown
            className={`h-3.5 w-3.5 text-purple transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
        {/* Animated underline */}
        <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-purple transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Dropdown */}
      {hasChildren && (
        <div
          className={`absolute left-0 top-full z-50 pt-2 transition-all duration-200 ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0"
          }`}
        >
          <div className="min-w-[200px] rounded-xl border border-border/60 bg-white py-1.5 shadow-dropdown">
            {link.children!.map((child) => (
              <DesktopFlyoutItem
                key={child.href + child.label}
                link={child}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Header ───────────────────────────── */

interface HeaderProps {
  menuItems?: NavLink[];
}

export function Header({ menuItems = [] }: HeaderProps) {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const [cartBounce, setCartBounce] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Animate cart badge when count changes
  useEffect(() => {
    if (itemCount > prevCount) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Mobile menu button */}
        <button
          className="rounded-lg p-1 transition-transform active:scale-90 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="group relative flex h-10 w-28 shrink-0 md:h-12 md:w-36">
          <Image
            src="/logo-vdubs.png"
            alt="V-Dub's Cards"
            fill
            className="object-contain object-left transition-opacity group-hover:opacity-90"
            priority
            sizes="(max-width: 768px) 112px, 144px"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {menuItems.map((link) => (
            <DesktopTopNavItem
              key={link.href + link.label}
              link={link}
            />
          ))}
        </nav>

        {/* Right side: search + icons */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <form
            action="/search"
            method="GET"
            className={`hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-all duration-300 md:flex ${
              searchFocused
                ? "w-64 border-primary shadow-[0_0_0_3px_rgba(255,204,2,0.15)]"
                : "w-48 border-border"
            }`}
          >
            <Search
              className={`h-4 w-4 shrink-0 transition-colors ${searchFocused ? "text-primary" : ""}`}
            />
            <input
              ref={searchRef}
              type="search"
              name="q"
              placeholder="Search products..."
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </form>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-foreground transition-all duration-200 hover:scale-110 hover:bg-muted active:scale-95"
          >
            <Heart className="h-5 w-5 transition-colors hover:text-purple" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-foreground transition-all duration-200 hover:scale-110 hover:bg-muted hover:text-purple active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple text-[10px] font-bold text-white transition-transform ${
                  cartBounce ? "animate-bounce" : ""
                }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`overflow-y-auto border-t border-border bg-white transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[70vh] opacity-100"
            : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-0.5 px-4 py-4">
          {menuItems.map((link) => (
            <MobileNavItem
              key={link.href + link.label}
              link={link}
              onNavigate={() => setMobileOpen(false)}
              depth={0}
            />
          ))}
          {/* Mobile search */}
          <form
            action="/search"
            method="GET"
            className="mt-3 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2 text-sm transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(255,204,2,0.15)]"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
            />
          </form>
        </div>
      </nav>
    </header>
  );
}
