"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = images[selectedIndex] ?? images[0];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-gray-100 text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={selected.url}
          alt={selected.altText ?? title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === selectedIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-1 ring-border opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
