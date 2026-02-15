import Image from "next/image";
import type { ShopifyProduct } from "@/lib/shopify/types";

interface ProductCardImageProps {
  product: ShopifyProduct;
  sizes?: string;
  className?: string;
}

export function ProductCardImage({
  product,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  className = "",
}: ProductCardImageProps) {
  const firstImage = product.featuredImage;
  const secondImage = product.images?.edges?.[1]?.node ?? null;

  if (!firstImage) {
    return (
      <div
        className={`relative flex aspect-[3/4] items-center justify-center bg-muted text-muted-foreground ${className}`}
      >
        Geen afbeelding
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden bg-muted ${className}`}
    >
      <Image
        src={firstImage.url}
        alt={firstImage.altText ?? product.title}
        fill
        className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        sizes={sizes}
      />
      {secondImage && (
        <Image
          src={secondImage.url}
          alt={secondImage.altText ?? product.title}
          fill
          className="absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          sizes={sizes}
        />
      )}
    </div>
  );
}
