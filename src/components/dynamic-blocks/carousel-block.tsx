"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCarousel } from "@/types/strapi";
import useEmblaCarousel from "embla-carousel-react";
import { useMemo } from "react";

import Image from "next/image";

interface CarouselBlockProps {
  block: StrapiArticleCarousel;
}

function getRotationForImage(imageId: number) {
  const seed = Math.abs(Math.sin(imageId) * 10000);
  const random = seed - Math.floor(seed);
  return Math.round((random * 4 - 2) * 100) / 100; 
}

export function CarouselBlock({ block }: CarouselBlockProps) {
  const images = useMemo(() => block.images || [], [block.images]);

  const imageRotations = useMemo(() => {
    return images.map((image) => getRotationForImage(image.id));
  }, [images]);

  const [containerRef] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true,
  });
  if (images.length === 0) {
    return null;
  }

  return (
    <section className={`py-9 relative lg:py-18 w-full full-width${block.backgroundColor ? ` bg-${block.backgroundColor}` : ""}`}>
      <div className="absolute top-[-27px] left-0 w-full h-[50px] bg-center bg-repeat"
      style={{ backgroundImage: `url("/images/article/carousel_ripped_top.png")`, 
        backgroundSize: "auto 100%",
      }}
      />
      {block.backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={getStrapiImageUrl(block.backgroundImage.url)}
            alt={block.backgroundImage.alternativeText || "Carousel background image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div
        className="scroll-smooth cursor-grab"
        ref={containerRef}
      >
        <div className="flex -ml-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden" style={{ transform: `rotate(${imageRotations[index]}deg)` }}>
                <Image
                  src={getStrapiImageUrl(image.url)}
                  alt={image.alternativeText || "Carousel image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 w-full h-full bg-center bg-no-repeat mix-blend-screen"
                style={{
                  backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                  backgroundSize: "auto 100%",
                  transform: index % 2 === 1 ? "rotate(180deg)" : undefined,
                }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[-27px] left-0 w-full h-[50px] bg-center bg-repeat"
      style={{ backgroundImage: `url("/images/article/carousel_ripped_bottom.png")`, 
        backgroundSize: "auto 100%",
      }}
      />
    </section>
  );
}
