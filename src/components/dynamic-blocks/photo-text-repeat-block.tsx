"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

import Grid from "@/components/common/grid/grid";
import { Title } from "@/components/ui/title";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass, getRepeatShadow } from "@/lib/utils";
import type { StrapiCommonPhotoTextRepeat } from "@/types/strapi";

gsap.registerPlugin(ScrollTrigger);

interface PhotoTextRepeatBlockProps {
  block: StrapiCommonPhotoTextRepeat;
}

const imagePositionStyles = [
  "-rotate-7 z-10 lg:translate-x-[-10px] lg:translate-y-[-85px] lg:-rotate-5",
  "rotate-10 translate-x-[20px] translate-y-[-20px] lg:translate-x-[105px] lg:translate-y-[-135px] lg:rotate-14",
  "rotate-10 translate-x-[-10px] translate-y-[-10px] lg:translate-x-[-115px] lg:translate-y-[-225px] lg:rotate-8",
  "-rotate-8 translate-x-[20px] translate-y-[-20px] lg:translate-x-[85px] lg:translate-y-[-135px] lg:-rotate-6",
];

const parallaxValues = [80, -120, 100, -60];

export function PhotoTextRepeatBlock({ block }: PhotoTextRepeatBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const bgColor = getColorClass(block.backgroundColor, "bg");
  const textColor = getColorClass(block.textColor);
  const hasMultipleImages = block.images && block.images.length > 1;

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 0 },
          {
            y: -150,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          },
        );
      }

      imagesRef.current.forEach((img, index) => {
        if (!img) return;

        gsap.fromTo(
          img,
          { y: 0 },
          {
            y: parallaxValues[index % parallaxValues.length],
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className={`py-28 overflow-hidden lg:pb-0 ${bgColor}`}
    >
      <Grid>
        <div className="col-span-full lg:col-start-3 lg:col-end-11">
          <div ref={titleRef}>
            <Title
              className={`text-[48px] lg:text-[120px] ${textColor}`}
              style={{ textShadow: getRepeatShadow(block.textColor) }}
            >
              {block.text}
            </Title>
          </div>
          <div className="flex flex-wrap md:max-w-1/2 mx-auto lg:max-w-full">
            {block.images?.map((image, index) => (
              <Image
                key={image.id}
                ref={(el) => {
                  imagesRef.current[index] = el;
                }}
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || ""}
                width={image.width || 1200}
                height={image.height || 600}
                className={cn(
                  "w-full h-full object-cover",
                  !hasMultipleImages && "-rotate-7",
                  hasMultipleImages && "w-1/2 max-w-[160px] lg:max-w-[442px]",
                  hasMultipleImages && imagePositionStyles[index],
                )}
              />
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
