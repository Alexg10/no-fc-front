"use client";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCarousel } from "@/types/strapi";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const { isDesktop } = useBreakpoints();
  const images = useMemo(() => block.images || [], [block.images]);

  const imageRotations = useMemo(() => {
    return images.map((image) => getRotationForImage(image.id));
  }, [images]);

  const [containerRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isInSection, setIsInSection] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  const lerpCursor = () => {
    setCursorPos((prev) => ({
      x: prev.x + (mousePos.current.x - prev.x) * 0.15,
      y: prev.y + (mousePos.current.y - prev.y) * 0.15,
    }));
    animationFrameId.current = requestAnimationFrame(lerpCursor);
  };

  useEffect(() => {
    if (isDesktop && isInSection) {
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(lerpCursor);
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isDesktop, isInSection, lerpCursor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop || !sectionRef.current) return;
    setIsInSection(true);
    const rect = sectionRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    setIsInSection(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current || !emblaApi) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;

    if (clickX > halfWidth) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`py-9 mb-15 relative lg:py-28 w-full full-width lg:mb-40 lg:cursor-none ${block.backgroundColor ? ` bg-${block.backgroundColor}` : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isInSection && (
        <div
          className="absolute pointer-events-none z-50 hidden lg:block"
          style={{
            left: `${cursorPos.x - 32.5}px`,
            top: `${cursorPos.y - 32.5}px`,
          }}
        >
          <Image
            src={"/images/article/carousel_cursor.webp"}
            alt={"Carousel cursor"}
            width={65}
            height={65}
            className="object-cover"
          />
        </div>
      )}
      <div
        className="absolute top-[-55px] left-0 w-full h-[100px] bg-repeat"
        style={{
          backgroundImage: `url("/images/article/carousel_ripped_top.webp")`,
          backgroundSize: "auto 100%",
        }}
      />
      {block.backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={getStrapiImageUrl(block.backgroundImage.url)}
            alt={
              block.backgroundImage.alternativeText ||
              "Carousel background image"
            }
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="scroll-smooth overflow-hidden" ref={containerRef}>
        <div className="flex -ml-4 ">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-[0_0_55%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_35%] overflow-hidden"
            >
              <div
                className="relative aspect-3/4 w-full overflow-hidden"
                style={{ transform: `rotate(${imageRotations[index]}deg)` }}
              >
                <Image
                  src={getStrapiImageUrl(image.url)}
                  alt={image.alternativeText || "Carousel image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className="absolute inset-0 w-full h-full bg-center bg-no-repeat mix-blend-screen"
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
      <div
        className="absolute bottom-[-52px] left-0 w-full h-[100px] bg-center bg-repeat"
        style={{
          backgroundImage: `url("/images/article/carousel_ripped_top.webp")`,
          backgroundSize: "auto 100%",
        }}
      />
    </section>
  );
}
