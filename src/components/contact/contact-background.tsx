"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiImage } from "@/types/strapi";
import { useDrag } from "@/contexts/drag-context";
import Image from "next/image";
import { useState } from "react";

interface ContactBackgroundProps {
  images: StrapiImage[];
}

function generateRandomImages(images: StrapiImage[]) {
  // Duplicate images once for better coverage
  const duplicatedImages = [...images, ...images];
  const positions = [];

  for (let i = 0; i < duplicatedImages.length; i++) {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomRotation = Math.random() * 40 - 20;

    positions.push({
      id: `${duplicatedImages[i].id}-${i}`,
      image: duplicatedImages[i],
      x: randomX,
      y: randomY,
      rotation: randomRotation,
    });
  }

  return positions;
}

export function ContactBackground({ images }: ContactBackgroundProps) {
  const { setIsDragging } = useDrag();
  // Generate positions once and keep them stable
  const [randomPositions] = useState(() => generateRandomImages(images));
  const [offsets, setOffsets] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, imageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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
    setIsDragging(false);
  };

  return (
    <div
      className="bg-image-wrapper absolute inset-0 overflow-hidden user-select-none pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={(e) => e.preventDefault()}
    >
      {randomPositions.map((item) => {
        const offset = offsets[item.id] || { x: 0, y: 0 };

        return (
          <div
            key={item.id}
            className="absolute cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) rotate(${item.rotation}deg)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          >
            <Image
              src={getStrapiImageUrl(item.image.url)}
              alt={item.image.alternativeText || ""}
              width={item.image.width}
              height={item.image.height}
              className="pointer-events-none"
              style={{
                maxWidth: "400px",
                height: "auto",
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}
