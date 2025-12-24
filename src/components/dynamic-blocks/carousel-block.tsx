"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCarousel } from "@/types/strapi";
import useEmblaCarousel from "embla-carousel-react";

import Image from "next/image";

interface CarouselBlockProps {
  block: StrapiArticleCarousel;
}

export function CarouselBlock({ block }: CarouselBlockProps) {
  const images = block.images || [];

  const [containerRef] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true,
  });
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="my-8 w-full full-width">
      <div
        className="overflow-hidden scroll-smooth cursor-grab"
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
    </section>
  );
}
