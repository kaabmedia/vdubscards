"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

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

const ZOOM_SCALE = 2;

export function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = images[selectedIndex] ?? images[0];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setZoomPosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    },
    []
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsZooming(true);
      handleMouseMove(e);
    },
    [handleMouseMove]
  );
  const handleMouseLeave = useCallback(() => setIsZooming(false), []);

  const zoomOrigin = `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`;

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-gray-100 text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with zoom */}
      <div
        ref={containerRef}
        className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 md:cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 transition-transform duration-75 will-change-transform"
          style={
            isZooming
              ? {
                  transformOrigin: zoomOrigin,
                  transform: `scale(${ZOOM_SCALE})`,
                }
              : undefined
          }
        >
          <Image
            src={selected.url}
            alt={selected.altText ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            draggable={false}
          />
        </div>
        {/* Zoom indicator */}
        <div
          className={`pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 ${
            isZooming ? "opacity-0" : ""
          }`}
        >
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Hover to zoom</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
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
