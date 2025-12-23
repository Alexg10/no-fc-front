"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCarousel } from "@/types/strapi";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

interface CarouselBlockProps {
  block: StrapiArticleCarousel;
}

export function CarouselBlock({ block }: CarouselBlockProps) {
  const images = block.images || [];

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="my-8 cursor-grab full-width">
      <Splide
        options={{
          type: "loop",
          arrows: false,
          pagination: false,
          drag: "free",
          perPage: 3,
          focus: "center",
          gap: "5rem",
          responsive: {
            640: {
              perPage: 1,
            },
            1024: {
              perPage: 2,
            },
          },
        }}
      >
        {images.map((image) => (
          <SplideSlide key={image.id}>
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
              <Image
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || "Carousel image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}
