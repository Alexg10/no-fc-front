"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleImageStack, StrapiImage } from "@/types/strapi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Native touchmove listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => {
      if (isDraggingRef.current) e.preventDefault();
    };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, []);

  const startDrag = (clientX: number, clientY: number, imageId: number) => {
    const offset = offsets[imageId] || { x: 0, y: 0 };
    setDraggedImageId(imageId);
    isDraggingRef.current = true;
    setDragOffset({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (draggedImageId === null) return;
    setOffsets((prev) => ({
      ...prev,
      [draggedImageId]: {
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      },
    }));
  };

  const endDrag = () => {
    setDraggedImageId(null);
    isDraggingRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent, imageId: number) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY, imageId);
  };

  const handleTouchStart = (e: React.TouchEvent, imageId: number) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY, imageId);
  };

  return (
    <section className="py-10 mb-7 flex">
      <div className="flex w-full px-4 max-w-[1424px] mx-auto lg:grid lg:grid-cols-12 lg:gap-6">
        <div
          ref={containerRef}
          className={cn(
            "col-span-full",
            images.length === 2
              ? "flex gap-4 lg:col-start-2 lg:col-end-12 justify-center"
              : "relative flex flex-wrap lg:col-span-full lg:h-[800px] lg:items-start",
          )}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={(e) => {
            const t = e.touches[0];
            moveDrag(t.clientX, t.clientY);
          }}
          onTouchEnd={endDrag}
          onTouchCancel={endDrag}
        >
          {images.length > 0 &&
            images.map((image: StrapiImage) => {
              const offset = offsets[image.id] || { x: 0, y: 0 };

              return (
                <div
                  key={image.id}
                  className={cn(
                    "relative cursor-grab active:cursor-grabbing self-start",
                    images.length === 2
                      ? "first:-rotate-6 last:rotate-[4deg] first:translate-x-[5px] last:translate-x-[-10px] last:translate-y-[30px]"
                      : [
                          "max-w-1/2 lg:max-w-[474px] lg:absolute",
                          "first:-rotate-6 first:lg:top-[8%] first:lg:-left-10",
                          "nth-2:rotate-4 nth-2:z-10 nth-2:lg:top-[10%] nth-2:lg:left-[23%]",
                          "nth-3:-rotate-6 nth-3:lg:top-6 nth-3:lg:left-[50%]",
                          "last:rotate-[4deg] last:z-10 last:lg:top-[25%] last:lg:right-[0%] last:lg:w-[374px] last:lg:translate-x-[60px]",
                        ].join(" "),
                  )}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, image.id)}
                  onTouchStart={(e) => handleTouchStart(e, image.id)}
                >
                  <div className="relative inline-block overflow-hidden lg:block lg:max-w-[474px] transition-shadow hover:shadow-lg">
                    <Image
                      src={getStrapiImageUrl(image.url)}
                      alt={image.alternativeText || ""}
                      width={image.width || 800}
                      height={image.height || 600}
                      className="w-full h-auto pointer-events-none"
                      draggable={false}
                    />
                    <div
                      className="absolute -top-px -left-px w-[calc(100%+2px)] h-[calc(100%+2px)] bg-center bg-no-repeat mix-blend-screen z-10"
                      style={{
                        backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                        backgroundSize: "100% 100%",
                      }}
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
