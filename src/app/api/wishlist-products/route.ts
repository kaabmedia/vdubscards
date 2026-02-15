import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/shopify/queries";
import type { ProductsByIdsResponse } from "@/lib/shopify/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const multiple = searchParams.getAll("ids");
  const single = searchParams.get("ids");
  const ids = multiple.length > 0
    ? multiple.map((id) => id.trim()).filter(Boolean)
    : (single ?? "").split(",").map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  try {
    const data = await shopifyFetch<ProductsByIdsResponse>({
      query: PRODUCTS_BY_IDS_QUERY,
      variables: { ids },
    });
    const products = (data?.nodes ?? []).filter(
      (n): n is NonNullable<typeof n> => n != null && "handle" in n
    );
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
