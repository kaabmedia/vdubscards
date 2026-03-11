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
import type { ShopifyProduct } from "@/lib/shopify/types";

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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<ShopifyProduct[]>([]);
  const [mobileSearchLoading, setMobileSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const [cartBounce, setCartBounce] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  // Animate cart badge when count changes
  useEffect(() => {
    if (itemCount > prevCount) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileSearchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  // Close mobile search on Escape
  useEffect(() => {
    if (!mobileSearchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileSearchOpen]);

  // Debounced live search with abort
  useEffect(() => {
    const q = mobileSearchQuery.trim();
    if (q.length < 2) {
      searchAbortRef.current?.abort();
      setMobileSearchResults([]);
      setMobileSearchLoading(false);
      return;
    }
    setMobileSearchLoading(true);
    const t = setTimeout(async () => {
      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      try {
        const res = await fetch(
          `/api/search/products?q=${encodeURIComponent(q)}&first=4`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setMobileSearchResults(data.products?.slice(0, 4) ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setMobileSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setMobileSearchLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      searchAbortRef.current?.abort();
    };
  }, [mobileSearchQuery]);

  const openMobileMenu = () => {
    setMobileSearchOpen(false);
    setMobileSearchQuery("");
    setMobileSearchResults([]);
    setMobileOpen((o) => !o);
  };

  const openMobileSearch = () => {
    setMobileOpen(false);
    setMobileSearchOpen((o) => {
      if (o) {
        setMobileSearchQuery("");
        setMobileSearchResults([]);
      }
      return !o;
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="relative container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Mobile left: hamburger + search */}
        <div className="flex items-center gap-0.5 lg:hidden">
          <button
            className="rounded-lg p-2 transition-colors hover:bg-muted active:scale-90"
            onClick={openMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-muted active:scale-90 md:hidden"
            onClick={openMobileSearch}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="group absolute left-1/2 flex h-10 w-28 -translate-x-1/2 shrink-0 lg:static lg:translate-x-0 md:h-12 md:w-36"
        >
          <Image
            src="/logo-vdubs.png"
            alt="V-Dub's Cards"
            fill
            className="object-contain object-center transition-opacity group-hover:opacity-90 lg:object-left"
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
          {/* Desktop search bar */}
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

      {/* Mobile search – fullscreen overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden">
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <button
              type="button"
              onClick={() => { setMobileSearchOpen(false); setMobileSearchQuery(""); setMobileSearchResults([]); }}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <form
              action="/search"
              method="GET"
              className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(255,204,2,0.12)] transition-all"
              onSubmit={() => { setMobileSearchOpen(false); setMobileSearchQuery(""); setMobileSearchResults([]); }}
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={mobileSearchRef}
                type="search"
                name="q"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                style={{ fontSize: "16px" }}
                aria-label="Search products"
                autoComplete="off"
                enterKeyHint="search"
              />
              {mobileSearchLoading && (
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-border border-t-primary" />
              )}
            </form>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {mobileSearchQuery.trim().length < 2 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">Start typing to search...</p>
            ) : mobileSearchLoading && mobileSearchResults.length === 0 ? (
              /* Skeleton */
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col overflow-hidden rounded-xl border border-border">
                    <div className="aspect-square animate-pulse bg-muted" />
                    <div className="space-y-2 p-2.5">
                      <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-muted" />
                      <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-muted" />
                      <div className="h-2.5 w-1/4 animate-pulse rounded-full bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mobileSearchResults.length > 0 ? (
              <div className={`transition-opacity duration-200 ${mobileSearchLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {mobileSearchResults.map((product) => {
                    const price = new Intl.NumberFormat("nl-NL", {
                      style: "currency",
                      currency: product.priceRange.minVariantPrice.currencyCode,
                    }).format(parseFloat(product.priceRange.minVariantPrice.amount));
                    return (
                      <Link
                        key={product.id}
                        href={`/producten/${product.handle}`}
                        onClick={() => { setMobileSearchOpen(false); setMobileSearchQuery(""); setMobileSearchResults([]); }}
                        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all active:scale-[0.97]"
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {product.featuredImage ? (
                            <Image
                              src={product.featuredImage.url}
                              alt={product.featuredImage.altText ?? product.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="45vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag className="h-8 w-8 opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="line-clamp-2 text-xs font-medium leading-tight text-foreground">
                            {product.title}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-primary">{price}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`}
                  onClick={() => { setMobileSearchOpen(false); setMobileSearchQuery(""); setMobileSearchResults([]); }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted active:bg-muted"
                >
                  <Search className="h-4 w-4" />
                  All results for &ldquo;{mobileSearchQuery.trim()}&rdquo;
                </Link>
              </div>
            ) : (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{mobileSearchQuery.trim()}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav
        className={`overflow-y-auto border-border bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? "border-t max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
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
        </div>
      </nav>
    </header>
  );
}
