"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart, type CartLine } from "@/components/cart/CartProvider";
import { trackBeginCheckout } from "@/lib/analytics/gtm";

interface CartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    quantityAvailable?: number | null;
    image: { url: string; altText: string | null } | null;
    product: { title: string; handle: string };
    price: { amount: string; currencyCode: string };
  };
}

interface FetchedCart {
  id: string;
  checkoutUrl: string | null;
  lines: { edges: Array<{ node: CartLineNode }> };
}

function formatPrice(amount: string | number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "EUR",
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
}

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartId,
    checkoutUrl,
    lines,
    itemCount,
    updateQuantity,
    removeLine,
    setCheckoutUrl,
    syncCartToShopify,
  } = useCart();

  const [cart, setCart] = useState<FetchedCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const fetchCart = useCallback(() => {
    if (!cartId) return;
    setLoading(true);
    fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
      .then((res) => res.json())
      .then((data) => setCart(data?.id ? data : null))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, [cartId]);

  // Load cart details whenever the drawer opens or the item count changes.
  useEffect(() => {
    if (!isCartOpen) return;
    if (cartId) fetchCart();
    else if (itemCount > 0) syncCartToShopify();
  }, [isCartOpen, cartId, itemCount, fetchCart, syncCartToShopify]);

  // Close on route change (e.g. clicking a product link inside the drawer).
  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!isCartOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, closeCart]);

  const cartLines = cart?.lines?.edges?.map((e) => e.node) ?? [];
  const isEmpty = itemCount === 0;
  const displayCheckoutUrl = cart?.checkoutUrl ?? checkoutUrl;
  const subtotal = cartLines.reduce(
    (sum, line) => sum + parseFloat(line.merchandise.price.amount) * line.quantity,
    0
  );

  /** Push the full desired line set to Shopify so checkout + totals stay in sync. */
  const pushLines = useCallback(
    async (next: CartLine[]) => {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cartId ?? undefined, lines: next }),
        });
        const data = await res.json();
        if (data?.checkoutUrl != null) setCheckoutUrl(data.checkoutUrl);
      } catch {
        /* ignore — optimistic UI already updated */
      }
    },
    [cartId, setCheckoutUrl]
  );

  const changeQuantity = (
    variantId: string,
    newQty: number,
    maxQty?: number | null
  ) => {
    setUpdating((prev) => new Set(prev).add(variantId));
    const capped = maxQty != null && maxQty > 0 ? Math.min(newQty, maxQty) : newQty;

    if (capped <= 0) {
      removeLine(variantId); // already syncs to Shopify
    } else {
      updateQuantity(variantId, capped);
      const next = lines.map((l) =>
        l.variantId === variantId ? { ...l, quantity: capped } : l
      );
      pushLines(next);
    }

    // Optimistic local display update.
    setCart((prev) => {
      if (!prev) return prev;
      const edges =
        capped <= 0
          ? prev.lines.edges.filter((e) => e.node.merchandise.id !== variantId)
          : prev.lines.edges.map((e) =>
              e.node.merchandise.id === variantId
                ? { node: { ...e.node, quantity: capped } }
                : e
            );
      return { ...prev, lines: { edges } };
    });

    setTimeout(() => {
      setUpdating((prev) => {
        const nextSet = new Set(prev);
        nextSet.delete(variantId);
        return nextSet;
      });
    }, 500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-base font-bold">
              Your bag
              {itemCount > 0 && (
                <span className="ml-1 font-normal text-muted-foreground">
                  ({itemCount})
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Your bag is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add some cards to get started.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Continue shopping
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : loading && cartLines.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul className="divide-y divide-border px-5">
              {cartLines.map((line) => {
                const lineTotal =
                  parseFloat(line.merchandise.price.amount) * line.quantity;
                const isUpdating = updating.has(line.merchandise.id);
                const max = line.merchandise.quantityAvailable;
                return (
                  <li
                    key={line.id}
                    className={`flex gap-3 py-4 transition-opacity ${
                      isUpdating ? "opacity-50" : ""
                    }`}
                  >
                    <Link
                      href={`/producten/${line.merchandise.product.handle}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                    >
                      {line.merchandise.image?.url ? (
                        <Image
                          src={line.merchandise.image.url}
                          alt={
                            line.merchandise.image.altText ??
                            line.merchandise.product.title
                          }
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/producten/${line.merchandise.product.handle}`}
                        className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
                      >
                        {line.merchandise.product?.title ?? line.merchandise.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatPrice(line.merchandise.price.amount)}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                line.merchandise.id,
                                line.quantity - 1,
                                max
                              )
                            }
                            disabled={isUpdating}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(
                                line.merchandise.id,
                                line.quantity + 1,
                                max
                              )
                            }
                            disabled={
                              isUpdating ||
                              (max != null && line.quantity >= max)
                            }
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {formatPrice(lineTotal)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(line.merchandise.id, 0, max)
                            }
                            disabled={isUpdating}
                            className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Shipping calculated at checkout · Inc. VAT
            </p>

            {displayCheckoutUrl ? (
              <a
                href={displayCheckoutUrl}
                onClick={() =>
                  trackBeginCheckout(
                    cartLines.map((line) => ({
                      item_id: line.merchandise.id,
                      item_name: line.merchandise.product.title,
                      price: parseFloat(line.merchandise.price.amount),
                      quantity: line.quantity,
                    }))
                  )
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-background opacity-50"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Checkout
              </button>
            )}

            <Link
              href="/cart"
              className="mt-2 block w-full rounded-lg border border-border py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View full cart
            </Link>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure payment
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> Free shipping €125+
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
