"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductCardCarouselProps {
  images: ProductImage[];
  productTitle: string;
  isAboveFold?: boolean;
}

export function ProductCardCarousel({
  images,
  productTitle,
  isAboveFold = false,
}: ProductCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.slice(0, 5);
  const hasMultipleImages = displayImages.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  if (displayImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const currentImage = displayImages[currentIndex];

  return (
    <div className="relative w-full h-full group">
      <Image
        src={currentImage.url}
        alt={currentImage.altText || productTitle}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        loading={isAboveFold ? "eager" : "lazy"}
        priority={isAboveFold}
      />

      {hasMultipleImages && (
        <>
          {/* Bouton précédent */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 cursor-pointer opacity-0 duration-300 transition-opacity group-hover:opacity-100 -translate-y-1/2 size-14 bg-white flex items-center justify-center z-10"
            aria-label="Image précédente"
          >
            <div className="border-2 border-black  p-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>

          {/* Bouton suivant */}
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 cursor-pointer opacity-0 duration-300 transition-opacity group-hover:opacity-100 -translate-y-1/2 size-14 bg-white flex items-center justify-center z-10"
            aria-label="Image suivante"
          >
            <div className="border-2 border-black  p-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </>
      )}
    </div>
  );
}
