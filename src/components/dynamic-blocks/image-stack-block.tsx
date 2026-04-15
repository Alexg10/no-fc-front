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
              : "flex flex-wrap lg:col-span-full lg:justify-between",
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
                      : "max-w-1/2 lg:max-w-[474px] first:-rotate-6 nth-2:lg:mt-[-30px] nth-2:z-10 nth-2:lg:translate-x-[-290px] last:lg:rotate-[4deg] nth-2:lg:rotate-[-6deg] nth-2:rotate-[7deg] nth-3:rotate-[4deg] nth-3:lg:translate-x-[200px] nth-3:lg:mt-[-560px] first:translate-x-[5px] last:translate-x-[-10px] last:mt-[-20px] last:z-10 last:lg:mt-[-420px] last:lg:translate-x-[40px] first:lg:translate-x-[-160px]",
                  )}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, image.id)}
                  onTouchStart={(e) => handleTouchStart(e, image.id)}
                >
                  <div className="relative inline-block overflow-hidden  transition-shadow hover:shadow-lg">
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
