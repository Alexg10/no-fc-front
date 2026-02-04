"use client";

import { useDrag } from "@/contexts/drag-context";
import type { StrapiImage } from "@/types/strapi";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ImageItem } from "./image-item";

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

export const ContactBackground = memo(function ContactBackground({
  images,
}: ContactBackgroundProps) {
  const { setIsDragging } = useDrag();
  // Generate positions once and keep them stable
  const [randomPositions] = useState(() => generateRandomImages(images));
  const [offsets, setOffsets] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const stateRef = useRef({ draggedImageId, dragOffset, offsets });

  // Update ref after render - keeps ref fresh for event handlers without dependencies
  useEffect(() => {
    stateRef.current = { draggedImageId, dragOffset, offsets };
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, imageId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      const offset = stateRef.current.offsets[imageId] || { x: 0, y: 0 };
      setDraggedImageId(imageId);
      setDragOffset({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    },
    [setIsDragging]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { draggedImageId, dragOffset } = stateRef.current;
    if (draggedImageId === null) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setOffsets((prev) => ({
      ...prev,
      [draggedImageId]: { x: newX, y: newY },
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setDraggedImageId(null);
    setIsDragging(false);
  }, [setIsDragging]);

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
          <ImageItem
            key={item.id}
            id={item.id}
            image={item.image}
            x={item.x}
            y={item.y}
            rotation={item.rotation}
            offset={offset}
            onMouseDown={handleMouseDown}
          />
        );
      })}
    </div>
  );
});
