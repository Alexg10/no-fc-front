"use client";

import { useDrag } from "@/contexts/drag-context";
import type { StrapiImage } from "@/types/strapi";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ImageItem } from "./image-item";

interface ContactBackgroundProps {
  images: StrapiImage[];
}

function generateRandomImages(images: StrapiImage[]) {
  // Duplicate images twice for better coverage
  const duplicatedImages = [...images, ...images];
  const positions = [];

  // Grid-based placement with jitter to avoid clustering
  const cols = Math.ceil(Math.sqrt(duplicatedImages.length * 1.5));
  const rows = Math.ceil(duplicatedImages.length / cols);

  for (let i = 0; i < duplicatedImages.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Base position from grid, add jitter for organic feel
    const baseX = (col / cols) * 100 + 50 / cols;
    const baseY = (row / rows) * 100 + 50 / rows;
    const jitterX = (Math.random() - 0.5) * (80 / cols);
    const jitterY = (Math.random() - 0.5) * (80 / rows);

    const randomX = Math.min(95, Math.max(5, baseX + jitterX));
    const randomY = Math.min(95, Math.max(5, baseY + jitterY));

    // Wide rotation range: -45 to +45, biased toward extremes (avoid near-zero)
    const sign = Math.random() < 0.5 ? -1 : 1;
    const randomRotation = sign * (8 + Math.random() * 37);

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
