import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import {
  CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from "@/lib/shopify/queries";

/** GET /api/cart?cartId=... - Haal cart op met productinformatie */
export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json(
      { error: "cartId is verplicht" },
      { status: 400 }
    );
  }
  try {
    const data = await shopifyFetch<{ cart: CartResponse | null }>({
      query: CART_QUERY,
      variables: { cartId },
    });
    return NextResponse.json(data?.cart ?? null);
  } catch (e) {
    console.error("Cart GET error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cart ophalen mislukt" },
      { status: 500 }
    );
  }
}

/** POST /api/cart - Maak cart of sync regels. Body: { cartId?: string, lines: [{ variantId, quantity }] } (volledige gewenste inhoud) */
export async function POST(request: NextRequest) {
  let body: { cartId?: string; lines: Array<{ variantId: string; quantity: number }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON" }, { status: 400 });
  }
  const { cartId, lines } = body;
  const linesArr = Array.isArray(lines) ? lines : [];
  if (!cartId && !linesArr.length) {
    return NextResponse.json(
      { error: "lines is verplicht en mag niet leeg zijn" },
      { status: 400 }
    );
  }

  const cartLineInput = linesArr.map((l) => ({
    merchandiseId: l.variantId,
    quantity: l.quantity,
  }));

  try {
    if (!cartId) {
      if (!cartLineInput.length) {
        return NextResponse.json(
          { error: "lines is verplicht bij nieuwe cart" },
          { status: 400 }
        );
      }
      const result = await shopifyFetch<{
        cartCreate: {
          cart: { id: string; checkoutUrl: string } | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>({
        query: CREATE_CART_MUTATION,
        variables: { lines: cartLineInput },
      });
      const create = result?.cartCreate;
      if (create?.userErrors?.length) {
        return NextResponse.json(
          { error: create.userErrors.map((e) => e.message).join(", ") },
          { status: 400 }
        );
      }
      const cart = create?.cart;
      if (!cart) {
        return NextResponse.json(
          { error: "Geen cart aangemaakt" },
          { status: 500 }
        );
      }
      return NextResponse.json({
        cartId: cart.id,
        checkoutUrl: cart.checkoutUrl,
      });
    }

    // Bestaande cart: haal op en sync (update bestaande regels, voeg nieuwe toe)
    const cartData = await shopifyFetch<{ cart: CartResponse | null }>({
      query: CART_QUERY,
      variables: { cartId },
    });
    const existingCart = cartData?.cart;
    if (!existingCart) {
      return NextResponse.json(
        { error: "Cart niet gevonden; maak een nieuwe aan" },
        { status: 404 }
      );
    }

    const existingByVariant = new Map<string, { lineId: string; quantity: number }>();
    for (const edge of existingCart.lines.edges) {
      const node = edge.node;
      existingByVariant.set(node.merchandise.id, {
        lineId: node.id,
        quantity: node.quantity,
      });
    }

    const requestedVariantIds = new Set(linesArr.map((l) => l.variantId));
    const toUpdate: Array<{ id: string; quantity: number }> = [];
    const toAdd: Array<{ merchandiseId: string; quantity: number }> = [];
    const toRemove: string[] = [];

    for (const l of linesArr) {
      const existing = existingByVariant.get(l.variantId);
      if (existing) {
        toUpdate.push({ id: existing.lineId, quantity: l.quantity });
      } else {
        toAdd.push({ merchandiseId: l.variantId, quantity: l.quantity });
      }
    }
    for (const edge of existingCart.lines.edges) {
      const variantId = edge.node.merchandise.id;
      if (!requestedVariantIds.has(variantId)) {
        toRemove.push(edge.node.id);
      }
    }

    let lastCheckoutUrl: string | null = existingCart.checkoutUrl;

    if (toRemove.length > 0) {
      const removeResult = await shopifyFetch<{
        cartLinesRemove: {
          cart: { id: string; checkoutUrl: string | null } | null;
          userErrors: Array<{ message: string }>;
        };
      }>({
        query: CART_LINES_REMOVE_MUTATION,
        variables: { cartId, lineIds: toRemove },
      });
      const rem = removeResult?.cartLinesRemove;
      if (rem?.userErrors?.length) {
        return NextResponse.json(
          { error: rem.userErrors.map((e: { message: string }) => e.message).join(", ") },
          { status: 400 }
        );
      }
      if (rem?.cart?.checkoutUrl) lastCheckoutUrl = rem.cart.checkoutUrl;
    }

    if (toUpdate.length > 0) {
      const updateResult = await shopifyFetch<{
        cartLinesUpdate: {
          cart: { id: string; checkoutUrl: string | null } | null;
          userErrors: Array<{ message: string }>;
        };
      }>({
        query: CART_LINES_UPDATE_MUTATION,
        variables: {
          cartId,
          lines: toUpdate.map(({ id, quantity }) => ({ id, quantity })),
        },
      });
      const upd = updateResult?.cartLinesUpdate;
      if (upd?.userErrors?.length) {
        return NextResponse.json(
          { error: upd.userErrors.map((e) => e.message).join(", ") },
          { status: 400 }
        );
      }
      if (upd?.cart?.checkoutUrl) lastCheckoutUrl = upd.cart.checkoutUrl;
    }

    if (toAdd.length > 0) {
      const addResult = await shopifyFetch<{
        cartLinesAdd: {
          cart: { id: string; checkoutUrl: string | null } | null;
          userErrors: Array<{ message: string }>;
        };
      }>({
        query: ADD_TO_CART_MUTATION,
        variables: {
          cartId,
          lines: toAdd.map((l) => ({ merchandiseId: l.merchandiseId, quantity: l.quantity })),
        },
      });
      const add = addResult?.cartLinesAdd;
      if (add?.userErrors?.length) {
        return NextResponse.json(
          { error: add.userErrors.map((e) => e.message).join(", ") },
          { status: 400 }
        );
      }
      if (add?.cart?.checkoutUrl) lastCheckoutUrl = add.cart.checkoutUrl;
    }

    return NextResponse.json({
      cartId,
      checkoutUrl: lastCheckoutUrl,
    });
  } catch (e) {
    console.error("Cart POST error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cart actie mislukt" },
      { status: 500 }
    );
  }
}

interface CartResponse {
  id: string;
  checkoutUrl: string | null;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          image: { url: string; altText: string | null; width: number; height: number } | null;
          product: { title: string; handle: string };
          price: { amount: string; currencyCode: string };
        };
      };
    }>;
  };
}
