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

const MAX_CART_RETRIES = 3;
const CART_RETRY_DELAY_MS = 300;

function isCartConflictError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /conflict/i.test(msg) || /conflicted/i.test(msg);
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

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_CART_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, CART_RETRY_DELAY_MS * attempt));
      }
      const result = await executeCartPost(cartId, linesArr, cartLineInput);
      return NextResponse.json(result);
    } catch (e) {
      lastError = e;
      if (!isCartConflictError(e) || attempt === MAX_CART_RETRIES - 1) break;
    }
  }

  console.error("Cart POST error:", lastError);
  return NextResponse.json(
    { error: lastError instanceof Error ? lastError.message : "Cart actie mislukt" },
    { status: 500 }
  );
}

async function executeCartPost(
  cartId: string | undefined,
  linesArr: Array<{ variantId: string; quantity: number }>,
  cartLineInput: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ cartId: string; checkoutUrl: string | null }> {
  if (!cartId) {
    if (!cartLineInput.length) {
      throw new Error("lines is verplicht bij nieuwe cart");
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
      throw new Error(create.userErrors.map((e) => e.message).join(", "));
    }
    const cart = create?.cart;
    if (!cart) {
      throw new Error("Geen cart aangemaakt");
    }
    return { cartId: cart.id, checkoutUrl: cart.checkoutUrl };
  }

  // Bestaande cart: haal op en sync (update bestaande regels, voeg nieuwe toe)
  const cartData = await shopifyFetch<{ cart: CartResponse | null }>({
    query: CART_QUERY,
    variables: { cartId },
  });
  const existingCart = cartData?.cart;
  if (!existingCart) {
    throw new Error("Cart niet gevonden; maak een nieuwe aan");
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
      throw new Error(rem.userErrors.map((e: { message: string }) => e.message).join(", "));
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
        throw new Error(upd.userErrors.map((e: { message: string }) => e.message).join(", "));
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
      throw new Error(add.userErrors.map((e: { message: string }) => e.message).join(", "));
    }
    if (add?.cart?.checkoutUrl) lastCheckoutUrl = add.cart.checkoutUrl;
  }

  return { cartId, checkoutUrl: lastCheckoutUrl };
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
