"use client";

import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageCarousel({
  images,
  productTitle,
}: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length === 0) return null;

  return (
    <div className="w-full relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.slice(0, 5).map((image, index) => (
            <div key={image.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.altText || productTitle}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-3 mt-4 px-4 absolute bottom-4 left-0 w-full">
          {images.slice(0, 5).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`size-4 transition-colors flex items-center justify-center ${
                index === selectedIndex
                  ? "bg-white border-2 border-white"
                  : "bg-transparent border-2 border-transparent"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Aller à l'image ${index + 1}`}
            >
              <span
                className={cn(
                  "size-1 border",
                  index === selectedIndex ? "border-black" : "border-white",
                )}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
