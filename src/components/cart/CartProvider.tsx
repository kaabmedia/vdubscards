"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CART_ID_KEY = "vdubscards_cart_id";

export interface CartLine {
  variantId: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (variantId: string, quantity?: number) => void;
  removeLine: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  checkoutUrl: string | null;
  cartId: string | null;
  setCheckoutUrl: (url: string | null) => void;
  itemCount: number;
  clearCart: () => void;
  syncCartToShopify: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setStoredCartId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(CART_ID_KEY, id);
  else localStorage.removeItem(CART_ID_KEY);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    setCartId(getStoredCartId());
  }, []);

  // Haal cart op van Shopify bij laden (cartId uit localStorage) zodat itemCount klopt
  useEffect(() => {
    const id = cartId ?? getStoredCartId();
    if (!id || lines.length > 0) return;
    fetch(`/api/cart?cartId=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((cart) => {
        if (cart?.lines?.edges?.length) {
          const fetched: CartLine[] = cart.lines.edges.map(
            (e: { node: { merchandise: { id: string }; quantity: number } }) => ({
              variantId: e.node.merchandise.id,
              quantity: e.node.quantity,
            })
          );
          setLines(fetched);
        }
        if (cart?.checkoutUrl) setCheckoutUrl(cart.checkoutUrl);
      })
      .catch((e) => console.error("Cart fetch error:", e));
  }, [cartId, lines.length]);

  const syncCartToShopify = useCallback(async () => {
    if (lines.length === 0) return;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId ?? undefined,
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cart sync mislukt");
      if (data.cartId) {
        setCartId(data.cartId);
        setStoredCartId(data.cartId);
      }
      if (data.checkoutUrl != null) setCheckoutUrl(data.checkoutUrl);
    } catch (e) {
      console.error("Cart sync error:", e);
    }
  }, [lines, cartId]);

  const addLine = useCallback((variantId: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      const next = existing
        ? prev.map((l) =>
            l.variantId === variantId
              ? { ...l, quantity: l.quantity + quantity }
              : l
          )
        : [...prev, { variantId, quantity }];
      // Sync naar Shopify na state-update (fire-and-forget)
      queueMicrotask(() => {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId: getStoredCartId() ?? undefined,
            lines: next.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.cartId) {
              setStoredCartId(data.cartId);
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("cart-id", { detail: data.cartId }));
              }
            }
            if (data.checkoutUrl != null) {
              window.dispatchEvent(new CustomEvent("cart-checkout-url", { detail: data.checkoutUrl }));
            }
          })
          .catch((e) => console.error("Cart sync error:", e));
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const onCartId = (e: Event) => setCartId((e as CustomEvent).detail);
    const onCheckoutUrl = (e: Event) => setCheckoutUrl((e as CustomEvent).detail);
    window.addEventListener("cart-id", onCartId);
    window.addEventListener("cart-checkout-url", onCheckoutUrl);
    return () => {
      window.removeEventListener("cart-id", onCartId);
      window.removeEventListener("cart-checkout-url", onCheckoutUrl);
    };
  }, []);

  const removeLine = useCallback((variantId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.variantId !== variantId);
      const stored = getStoredCartId();
      if (stored) {
        queueMicrotask(() => {
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartId: stored,
              lines: next.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
            }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.cartId) {
                setStoredCartId(data.cartId);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("cart-id", { detail: data.cartId }));
                }
              }
              if (data.checkoutUrl != null) {
                window.dispatchEvent(new CustomEvent("cart-checkout-url", { detail: data.checkoutUrl }));
              }
            })
            .catch((e) => console.error("Cart sync error:", e));
        });
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((prev) => prev.filter((l) => l.variantId !== variantId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.variantId === variantId ? { ...l, quantity } : l
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setCheckoutUrl(null);
    setCartId(null);
    setStoredCartId(null);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      addLine,
      removeLine,
      updateQuantity,
      checkoutUrl,
      cartId,
      setCheckoutUrl,
      itemCount,
      clearCart,
      syncCartToShopify,
    }),
    [
      lines,
      addLine,
      removeLine,
      updateQuantity,
      checkoutUrl,
      cartId,
      itemCount,
      clearCart,
      syncCartToShopify,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
