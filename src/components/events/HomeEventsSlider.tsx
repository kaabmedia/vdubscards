"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomeEventsSliderProps {
  images: { url: string; alt?: string }[];
}

const AUTOPLAY_DELAY = 5000;

export function HomeEventsSlider({ images }: HomeEventsSliderProps) {
  if (images.length === 0) return null;

  return <HomeEventsSliderInner images={images} />;
}

function HomeEventsSliderInner({ images }: HomeEventsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: images.length > 1,
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay — pause on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi || images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [emblaApi, images.length, isPaused]);

  return (
    <div
      className="group/slider relative h-full overflow-hidden rounded-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
            >
              <div className="relative h-full w-full overflow-hidden bg-gray-100">
                <Image
                  src={img.url}
                  alt={img.alt ?? "Event foto"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev && !emblaApi?.internalEngine().options.loop}
            className="absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext && !emblaApi?.internalEngine().options.loop}
            className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
