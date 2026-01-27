"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleImageStack, StrapiImage } from "@/types/strapi";
import Image from "next/image";
import { useState } from "react";

interface ImageStackBlockProps {
  block: StrapiArticleImageStack;
}

export function ImageStackBlock({ block }: ImageStackBlockProps) {
  const [images] = useState<StrapiImage[]>(block.images || []);
  const [offsets, setOffsets] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, imageId: number) => {
    e.preventDefault();
    const offset = offsets[imageId] || { x: 0, y: 0 };
    setDraggedImageId(imageId);
    setDragOffset({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedImageId === null) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setOffsets((prev) => ({
      ...prev,
      [draggedImageId]: { x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    setDraggedImageId(null);
  };

  return (
    <section className="py-10 mb-7 flex overflow-hidden">
      <div className="flex w-full px-4 max-w-[1424px] mx-auto lg:grid lg:grid-cols-12 lg:gap-6">
        <div
          className={cn(
            "col-span-full",
            images.length === 2
              ? "flex gap-4 lg:col-start-2 lg:col-end-12"
              : "flex flex-wrap lg:col-span-full lg:justify-between",
          )}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {images.length > 0 &&
            images.map((image: StrapiImage) => {
              const offset = offsets[image.id] || { x: 0, y: 0 };

              return (
                <div
                  key={image.id}
                  className={cn(
                    "relative cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg",
                    images.length === 2
                      ? "first:-rotate-6 last:rotate-[4deg] first:translate-x-[5px] last:translate-x-[-10px] last:translate-y-[30px]"
                      : "max-w-1/2 lg:max-w-[474px] first:-rotate-6 nth-2:lg:translate-y-[190px] nth-2:lg:translate-y-[90px] nth-2:z-10 nth-2:lg:translate-x-[-90px] last:lg:rotate-[-4deg] last:lg:rotate-[4deg] nth-2:lg:rotate-[-6deg] nth-2:rotate-[7deg] nth-3:rotate-[4deg] nth-3:lg:translate-x-[250px] nth-3:lg:translate-y-[-330px] first:translate-x-[5px] last:translate-x-[-10px] last:translate-y-[-20px] last:lg:translate-y-[30px] last:z-10 last:lg:translate-y-[-300px]",
                  )}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    zIndex: 50,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, image.id)}
                >
                  <div className="relative inline-block h-full">
                    <div
                      className="absolute inset-0 w-full h-full bg-center bg-no-repeat mix-blend-screen"
                      style={{
                        backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                        backgroundSize: "100% 100%",
                      }}
                    />
                    <Image
                      src={getStrapiImageUrl(image.url)}
                      alt={image.alternativeText || ""}
                      width={image.width || 800}
                      height={image.height || 600}
                      className="w-full h-auto pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
