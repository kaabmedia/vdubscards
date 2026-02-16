"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShopifyProduct } from "@/lib/shopify/types";
import type { ShopifyFilter } from "@/lib/shopify/types";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Loader2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "RELEVANCE|false", label: "Relevance" },
  { value: "PRICE|false", label: "Price: low to high" },
  { value: "PRICE|true", label: "Price: high to low" },
];

const SKIPPED_FILTER_IDS = ["filter.v.price"];

const PRICE_RANGES: { label: string; min: number; max?: number }[] = [
  { label: "Under €25", min: 0, max: 25 },
  { label: "€25 - €50", min: 25, max: 50 },
  { label: "€50 - €100", min: 50, max: 100 },
  { label: "€100 - €250", min: 100, max: 250 },
  { label: "Above €250", min: 250 },
];

const PAGE_SIZE = 24;

interface SearchProductGridProps {
  query: string;
  initialProducts: ShopifyProduct[];
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
  totalProductsCount?: number | null;
  availableFilters: ShopifyFilter[];
}

function safeParseJson(s: string): Record<string, unknown> | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function getActiveFilters(searchParams: URLSearchParams): Record<string, unknown>[] {
  const raw = searchParams.get("filters");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isFilterActive(
  active: Record<string, unknown>[],
  input: Record<string, unknown>
): boolean {
  return active.some((f) => JSON.stringify(f) === JSON.stringify(input));
}

function toggleFilter(
  active: Record<string, unknown>[],
  input: Record<string, unknown>
): Record<string, unknown>[] {
  const inputStr = JSON.stringify(input);
  const exists = active.some((f) => JSON.stringify(f) === inputStr);
  if (exists) return active.filter((f) => JSON.stringify(f) !== inputStr);
  return [...active, input];
}

function isPriceFilter(f: Record<string, unknown>): boolean {
  return f != null && typeof f === "object" && "price" in f;
}

function priceFilterInput(min: number, max?: number): Record<string, unknown> {
  const price: { min: number; max?: number } = { min };
  if (max != null) price.max = max;
  return { price };
}

export function SearchProductGrid({
  query,
  initialProducts,
  initialEndCursor,
  initialHasNextPage,
  totalProductsCount = null,
  availableFilters,
}: SearchProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState(initialProducts);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [page, setPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [endCursorHistory, setEndCursorHistory] = useState<(string | null)[]>([initialEndCursor]);
  const [maxDiscoveredPage, setMaxDiscoveredPage] = useState(initialHasNextPage ? 2 : 1);
  const [navigating, setNavigating] = useState(false);

  const sortValue = searchParams.get("sortKey") ?? "RELEVANCE";
  const reverseParam = searchParams.get("reverse") ?? "false";
  const sortSelectValue = `${sortValue}|${reverseParam}`;
  const activeFilters = getActiveFilters(searchParams);

  const buildParams = useCallback(
    (overrides: { sortKey?: string; reverse?: string; filters?: Record<string, unknown>[] } = {}) => {
      const params = new URLSearchParams();
      params.set("q", query);
      params.set("sortKey", overrides.sortKey ?? searchParams.get("sortKey") ?? "RELEVANCE");
      params.set("reverse", overrides.reverse ?? searchParams.get("reverse") ?? "false");
      const filters = overrides.filters !== undefined ? overrides.filters : activeFilters;
      if (filters.length > 0) params.set("filters", JSON.stringify(filters));
      return params;
    },
    [query, searchParams, activeFilters]
  );

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false });
    });
    setPage(1);
    setCursorHistory([null]);
    setEndCursorHistory([]);
    setMaxDiscoveredPage(1);
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortKey, rev] = e.target.value.split("|");
    navigate(buildParams({ sortKey, reverse: rev }));
  };

  const handleToggleFilter = (input: Record<string, unknown>) => {
    navigate(buildParams({ filters: toggleFilter(activeFilters, input) }));
  };

  const handleTogglePriceFilter = (min: number, label: string, max?: number) => {
    const input = priceFilterInput(min, max);
    const withoutPrice = activeFilters.filter((f) => !isPriceFilter(f));
    const existingSame = activeFilters.some(
      (f) => isPriceFilter(f) && JSON.stringify(f) === JSON.stringify(input)
    );
    navigate(buildParams({
      filters: existingSame ? withoutPrice : [...withoutPrice, input],
    }));
  };

  const handleClearFilters = () => navigate(buildParams({ filters: [] }));

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchPage = async (cursor: string | null) => {
    const params = buildParams();
    if (cursor) params.set("after", cursor);
    const res = await fetch(`/api/search/products?${params.toString()}`);
    return res.json();
  };

  const goToPage = async (targetPage: number) => {
    if (targetPage === page || navigating || targetPage < 1) return;
    setNavigating(true);
    try {
      const cursorIndex = targetPage - 1;
      let cursor: string | null = null;
      if (cursorIndex < cursorHistory.length) {
        cursor = cursorHistory[cursorIndex];
      } else {
        let lastKnownCursor = endCursorHistory[endCursorHistory.length - 1];
        const newCursorHistory = [...cursorHistory];
        const newEndCursorHistory = [...endCursorHistory];
        for (let p = cursorHistory.length; p <= cursorIndex; p++) {
          if (!lastKnownCursor) break;
          newCursorHistory.push(lastKnownCursor);
          const data = await fetchPage(lastKnownCursor);
          if (!data.products?.length) break;
          lastKnownCursor = data.pageInfo?.endCursor ?? null;
          newEndCursorHistory.push(lastKnownCursor);
          if (data.pageInfo?.hasNextPage && p + 2 > maxDiscoveredPage) {
            setMaxDiscoveredPage(p + 2);
          }
        }
        setCursorHistory(newCursorHistory);
        setEndCursorHistory(newEndCursorHistory);
        cursor = newCursorHistory[cursorIndex] ?? null;
      }
      const data = await fetchPage(cursor);
      if (data.products?.length) {
        setProducts(data.products);
        setEndCursor(data.pageInfo?.endCursor ?? null);
        setHasNextPage(data.pageInfo?.hasNextPage ?? false);
        setPage(targetPage);
        if (targetPage <= cursorHistory.length) {
          setCursorHistory((prev) => prev.slice(0, targetPage));
        }
        setEndCursorHistory((prev) => {
          const updated = [...prev];
          updated[targetPage - 1] = data.pageInfo?.endCursor ?? null;
          return updated;
        });
        if (data.pageInfo?.hasNextPage && targetPage + 1 > maxDiscoveredPage) {
          setMaxDiscoveredPage(targetPage + 1);
        }
        if (!data.pageInfo?.hasNextPage) setMaxDiscoveredPage(targetPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setNavigating(false);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCursorHistory((prev) => {
        const updated = [...prev];
        if (updated.length <= page) updated.push(endCursor);
        else updated[page] = endCursor;
        return updated;
      });
      goToPage(page + 1);
    }
  };

  const renderableFilters = availableFilters.filter(
    (f) => !SKIPPED_FILTER_IDS.includes(f.id) && f.values.length > 0
  );

  const activeFilterLabels: { label: string; input: Record<string, unknown> }[] = [];
  for (const af of activeFilters) {
    if (isPriceFilter(af)) {
      const p = af.price as { min?: number; max?: number };
      const range = PRICE_RANGES.find(
        (r) => r.min === (p?.min ?? 0) && (r.max ?? null) === (p?.max ?? null)
      );
      activeFilterLabels.push({ label: range?.label ?? "Price", input: af });
    } else {
      const afStr = JSON.stringify(af);
      for (const filter of availableFilters) {
        for (const val of filter.values) {
          const parsed = safeParseJson(val.input);
          if (parsed && JSON.stringify(parsed) === afStr) {
            activeFilterLabels.push({ label: val.label, input: af });
          }
        }
      }
    }
  }

  const showEmpty = products.length === 0 && !isPending;
  const totalPages =
    totalProductsCount != null
      ? Math.max(1, Math.ceil(totalProductsCount / PAGE_SIZE))
      : maxDiscoveredPage;
  const fromItem = (page - 1) * PAGE_SIZE + 1;
  const toItem =
    totalProductsCount != null
      ? Math.min(page * PAGE_SIZE, totalProductsCount)
      : (page - 1) * PAGE_SIZE + products.length;

  const pageNumbers: (number | "dots")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push("dots");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (page < totalPages - 2) pageNumbers.push("dots");
    pageNumbers.push(totalPages);
  }

  const priceFilterSection = (
    <div className="border-b border-border/60 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => toggleSection("price")}
        className="flex w-full items-center justify-between text-[13px] font-semibold text-foreground"
      >
        Price
        <ChevronDown
          className={`h-3.5 w-3.5 text-purple transition-transform duration-200 ${
            collapsedSections["price"] ? "-rotate-90" : ""
          }`}
        />
      </button>
      {!collapsedSections["price"] && (
        <div className="mt-3 space-y-1 pr-1">
          {PRICE_RANGES.map((range) => {
            const input = priceFilterInput(range.min, range.max);
            const active = isFilterActive(activeFilters, input);
            return (
              <label
                key={range.label}
                className="group flex cursor-pointer items-center gap-2.5 py-1 text-[13px] select-none"
              >
                <span
                  role="checkbox"
                  aria-checked={active}
                  tabIndex={0}
                  onClick={() => handleTogglePriceFilter(range.min, range.label, range.max)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      handleTogglePriceFilter(range.min, range.label, range.max);
                    }
                  }}
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-all ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/80 bg-background group-hover:border-foreground/40"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </span>
                <span
                  onClick={() => handleTogglePriceFilter(range.min, range.label, range.max)}
                  className={`flex-1 leading-tight ${
                    active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );

  const filterSections = (
    <>
      {priceFilterSection}
      {renderableFilters.map((filter) => (
        <div key={filter.id} className="border-b border-border/60 py-4 last:border-b-0">
          <button
            type="button"
            onClick={() => toggleSection(filter.id)}
            className="flex w-full items-center justify-between text-[13px] font-semibold text-foreground"
          >
            {filter.label}
            <ChevronDown
              className={`h-3.5 w-3.5 text-purple transition-transform duration-200 ${
                collapsedSections[filter.id] ? "-rotate-90" : ""
              }`}
            />
          </button>
          {!collapsedSections[filter.id] && (
            <div className="mt-3 max-h-52 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
              {filter.values
                .filter((v) => v.count > 0)
                .map((v) => {
                  const parsed = safeParseJson(v.input);
                  if (!parsed) return null;
                  const active = isFilterActive(activeFilters, parsed);
                  return (
                    <label
                      key={v.id}
                      className="group flex cursor-pointer items-center gap-2.5 py-1 text-[13px] select-none"
                    >
                      <span
                        role="checkbox"
                        aria-checked={active}
                        tabIndex={0}
                        onClick={() => handleToggleFilter(parsed)}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            handleToggleFilter(parsed);
                          }
                        }}
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-all ${
                          active
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/80 bg-background group-hover:border-foreground/40"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
                      </span>
                      <span
                        onClick={() => handleToggleFilter(parsed)}
                        className={`flex-1 leading-tight ${
                          active ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {v.label}
                      </span>
                      <span
                        onClick={() => handleToggleFilter(parsed)}
                        className="shrink-0 text-[11px] tabular-nums text-muted-foreground/40"
                      >
                        ({v.count})
                      </span>
                    </label>
                  );
                })}
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="flex items-start gap-8 lg:gap-10">
      <aside className="hidden w-[240px] shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-5">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight text-foreground">Filters</h3>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-b border-border/60 pb-4">
                {activeFilterLabels.map((af, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-foreground/10 py-0.5 pl-2 pr-1 text-[11px] font-medium text-foreground"
                  >
                    {af.label}
                    <button
                      type="button"
                      onClick={() => handleToggleFilter(af.input)}
                      className="ml-0.5 rounded-full p-0.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {filterSections}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-background shadow-2xl scrollbar-thin">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4">
              <h3 className="text-sm font-bold text-foreground">Filters</h3>
              <button type="button" onClick={() => setSidebarOpen(false)} className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 pb-2">
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-b border-border/60 py-4">
                  {activeFilterLabels.map((af, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-foreground/10 py-0.5 pl-2 pr-1 text-[11px] font-medium text-foreground">
                      {af.label}
                      <button type="button" onClick={() => handleToggleFilter(af.input)} className="ml-0.5 rounded-full p-0.5 text-foreground/50 hover:text-foreground">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={handleClearFilters} className="text-[11px] text-muted-foreground hover:text-foreground">
                    Clear all
                  </button>
                </div>
              )}
              {filterSections}
            </div>
            <div className="sticky bottom-0 border-t border-border bg-background px-5 py-4">
              <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-foreground py-2.5 text-center text-sm font-semibold text-background transition-colors hover:bg-foreground/90">
                View results
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeFilters.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                  {activeFilters.length}
                </span>
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              {totalProductsCount != null
                ? `${fromItem}\u2013${toItem} of ${totalProductsCount} products`
                : `${products.length} product${products.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <select
            value={sortSelectValue}
            onChange={handleSortChange}
            disabled={isPending}
            aria-label="Sort by"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:opacity-50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {activeFilterLabels.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5 lg:hidden">
            {activeFilterLabels.map((af, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-foreground/10 py-0.5 pl-2.5 pr-1 text-xs font-medium text-foreground">
                {af.label}
                <button type="button" onClick={() => handleToggleFilter(af.input)} className="ml-0.5 rounded-full p-0.5 text-foreground/50 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button type="button" onClick={handleClearFilters} className="px-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
              Clear all
            </button>
          </div>
        )}

        {(isPending || navigating) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {showEmpty && (
          <div className="rounded-lg border border-dashed border-border px-6 py-20 text-center">
            <p className="text-sm text-muted-foreground">
              {activeFilters.length > 0
                ? "No products found with these filters."
                : "No products found for your search."}
            </p>
            {activeFilters.length > 0 && (
              <button type="button" onClick={handleClearFilters} className="mt-3 text-sm font-medium text-foreground underline underline-offset-2">
                Clear filters
              </button>
            )}
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && products.length > 0 && (
          <div className="mt-12 space-y-3 border-t border-border/60 pt-8">
            <p className="text-center text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <nav className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || navigating}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {pageNumbers.map((p, i) =>
                p === "dots" ? (
                  <span key={`dots-${i}`} className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    disabled={navigating}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page ? "bg-foreground text-background" : "border border-border bg-background hover:bg-muted"
                    } disabled:pointer-events-none`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasNextPage || navigating}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
