"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCarousel } from "@/types/strapi";
import { useCallback, useRef } from "react";
import Image from "next/image";

interface CarouselBlockProps {
  block: StrapiArticleCarousel;
}

export function CarouselBlock({ block }: CarouselBlockProps) {
  const images = block.images || [];
  const containerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return null;
  }

  const scroll = useCallback((direction: "prev" | "next") => {
    if (!containerRef.current) return;

    const scrollAmount = direction === "next" ? 400 : -400;
    containerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const scrollPrev = useCallback(() => scroll("prev"), [scroll]);
  const scrollNext = useCallback(() => scroll("next"), [scroll]);

  return (
    <section className="my-8 w-full">
      <div
        className="overflow-hidden scroll-smooth"
        ref={containerRef}
      >
        <div className="flex -ml-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
                <Image
                  src={getStrapiImageUrl(image.url)}
                  alt={image.alternativeText || "Carousel image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={scrollPrev}
          className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 transition-colors"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={scrollNext}
          className="rounded-lg bg-gray-200 p-2 hover:bg-gray-300 transition-colors"
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </section>
  );
}
