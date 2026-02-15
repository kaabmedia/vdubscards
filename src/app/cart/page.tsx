"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import {
  Loader2,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

interface CartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
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

export default function CartPage() {
  const { lines, itemCount, cartId, checkoutUrl, syncCartToShopify, updateQuantity, removeLine } =
    useCart();
  const [cart, setCart] = useState<FetchedCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set());

  const fetchCart = useCallback(() => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) setCart(data);
        else setCart(null);
      })
      .catch((e) => {
        setError(e.message || "Failed to load cart");
        setCart(null);
      })
      .finally(() => setLoading(false));
  }, [cartId]);

  useEffect(() => {
    if (cartId) {
      fetchCart();
    } else {
      setLoading(false);
      setCart(null);
    }
  }, [cartId, fetchCart]);

  useEffect(() => {
    if (!cartId && itemCount > 0) {
      syncCartToShopify();
    }
  }, [cartId, itemCount, syncCartToShopify]);

  const cartLines = cart?.lines?.edges?.map((e) => e.node) ?? [];
  const isEmpty = itemCount === 0 && cartLines.length === 0;
  const displayCheckoutUrl = cart?.checkoutUrl ?? checkoutUrl;

  const subtotal = cartLines.reduce(
    (sum, line) => sum + parseFloat(line.merchandise.price.amount) * line.quantity,
    0
  );

  const handleUpdateQuantity = async (variantId: string, newQty: number) => {
    setUpdatingLines((prev) => new Set(prev).add(variantId));
    if (newQty <= 0) {
      removeLine(variantId);
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lines: {
            edges: prev.lines.edges.filter(
              (e) => e.node.merchandise.id !== variantId
            ),
          },
        };
      });
    } else {
      updateQuantity(variantId, newQty);
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lines: {
            edges: prev.lines.edges.map((e) =>
              e.node.merchandise.id === variantId
                ? { node: { ...e.node, quantity: newQty } }
                : e
            ),
          },
        };
      });
    }
    // Re-sync after a short delay
    setTimeout(() => {
      setUpdatingLines((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }, 600);
  };

  const handleRemove = (variantId: string) => {
    handleUpdateQuantity(variantId, 0);
  };

  // Loading state
  if (loading && !cart) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Shopping cart</h1>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Link
            href="/collections/all"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground underline underline-offset-2"
          >
            View products
          </Link>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Shopping cart</h1>
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover our collection and add products.
            </p>
          </div>
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            View products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
        Shopping cart
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({cartLines.length} {cartLines.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="gap-10 lg:grid lg:grid-cols-[1fr_380px]">
        {/* Cart items */}
        <div>
          {/* Table header - desktop */}
          <div className="mb-4 hidden border-b border-border pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-[1fr_140px_100px_80px] md:gap-4">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          <ul className="divide-y divide-border">
            {cartLines.map((line) => {
              const lineTotal =
                parseFloat(line.merchandise.price.amount) * line.quantity;
              const isUpdating = updatingLines.has(line.merchandise.id);

              return (
                <li
                  key={line.id}
                  className={`grid items-center gap-4 py-5 transition-opacity md:grid-cols-[1fr_140px_100px_80px] ${
                    isUpdating ? "opacity-50" : ""
                  }`}
                >
                  {/* Product info */}
                  <div className="flex gap-4">
                    <Link
                      href={`/producten/${line.merchandise.product.handle}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted md:h-24 md:w-24"
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
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/producten/${line.merchandise.product.handle}`}
                        className="text-sm font-medium text-foreground hover:underline md:text-base"
                      >
                        {line.merchandise.product?.title ?? line.merchandise.title}
                      </Link>
                      {line.merchandise.title !== "Default Title" && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {line.merchandise.title}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(line.merchandise.price.amount)}
                      </p>

                      {/* Mobile quantity + remove */}
                      <div className="mt-3 flex items-center gap-3 md:hidden">
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                line.merchandise.id,
                                line.quantity - 1
                              )
                            }
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                line.merchandise.id,
                                line.quantity + 1
                              )
                            }
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(line.merchandise.id)}
                          disabled={isUpdating}
                          className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="ml-auto text-sm font-medium">
                          {formatPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop quantity */}
                  <div className="hidden justify-center md:flex">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            line.merchandise.id,
                            line.quantity - 1
                          )
                        }
                        disabled={isUpdating}
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex h-9 w-10 items-center justify-center border-x border-border text-sm font-medium">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            line.merchandise.id,
                            line.quantity + 1
                          )
                        }
                        disabled={isUpdating}
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop line total */}
                  <p className="hidden text-right text-sm font-medium md:block">
                    {formatPrice(lineTotal)}
                  </p>

                  {/* Desktop remove */}
                  <div className="hidden justify-end md:flex">
                    <button
                      type="button"
                      onClick={() => handleRemove(line.merchandise.id)}
                      disabled={isUpdating}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-30"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-border pt-6">
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-8 lg:mt-0">
          <div className="sticky top-24 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Summary
            </h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-foreground">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-xs text-muted-foreground">
                  Calculated at checkout
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                Inc. VAT
              </p>
            </div>

            {displayCheckoutUrl ? (
              <a
                href={displayCheckoutUrl}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                disabled
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3 text-sm font-semibold text-background opacity-50"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Checkout
              </button>
            )}

            {/* Trust signals */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Secure payment via Shopify</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 shrink-0" />
                <span>Free shipping from €125</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span>14-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
