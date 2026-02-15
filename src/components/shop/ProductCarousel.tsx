"use client";

import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCardImage } from "./ProductCardImage";

interface ProductCarouselProps {
  products: ShopifyProduct[];
  title?: string;
}

export function ProductCarousel({ products, title = "Laatste producten" }: ProductCarouselProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative px-10">
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="group overflow-hidden border-border">
                  <Link href={`/producten/${product.handle}`}>
                    <CardHeader className="p-0">
                      <ProductCardImage
                        product={product}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 md:-left-4" />
          <CarouselNext className="-right-2 md:-right-4" />
        </div>
      </Carousel>
    </section>
  );
}
