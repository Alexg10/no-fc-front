"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiImage } from "@/types/strapi";
import Image from "next/image";
import { memo } from "react";

import { useBreakpoints } from "@/hooks/useBreakpoints";
interface ImageItemProps {
  id: string;
  image: StrapiImage;
  x: number;
  y: number;
  rotation: number;
  offset: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent, imageId: string) => void;
}

export const ImageItem = memo(function ImageItem({
  id,
  image,
  x,
  y,
  rotation,
  offset,
  onMouseDown,
}: ImageItemProps) {
  const isUnderDesktop = useBreakpoints().isUnderDesktop;
  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) rotate(${rotation}deg)`,
      }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      <Image
        src={getStrapiImageUrl(image.url)}
        alt={image.alternativeText || ""}
        width={image.width}
        height={image.height}
        className="pointer-events-none"
        style={{
          maxWidth: isUnderDesktop ? "200px" : "400px",
          height: "auto",
        }}
        draggable={false}
      />
    </div>
  );
});
