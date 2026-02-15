import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCardImage } from "./ProductCardImage";

interface ProductGridProps {
  products: ShopifyProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground mb-2">
          Geen producten gevonden. Vaak komt dit door een <strong>401</strong>: het token in .env.local is geen geldig Storefront API-token.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Ga naar Shopify Admin → Instellingen → Apps en verkoopkanalen → Apps ontwikkelen → maak een app → Configuratie → <strong>Storefront API</strong> → zet scopes aan → kopieer het <strong>Storefront API access token</strong> (niet Admin API).
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/api/test-shopify" target="_blank" rel="noopener">
            Verbinding testen
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <Link href={`/producten/${product.handle}`}>
            <CardHeader className="p-0">
              <ProductCardImage product={product} />
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{product.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.priceRange.minVariantPrice.currencyCode}{" "}
                {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
            </CardContent>
          </Link>
          <CardFooter className="p-4 pt-0">
            <Button
              asChild
              className="w-full"
              size="sm"
            >
              <Link href={`/producten/${product.handle}`}>Bekijken</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
