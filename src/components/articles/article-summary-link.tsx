"use client";

import { useArticleRef } from "@/contexts/article-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SummaryItem {
  index: number;
  text: string;
  element: HTMLElement;
}

function smoothScrollTo(element: HTMLElement, duration = 600) {
  const start = window.scrollY;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-in-out cubic
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Recalcule la position cible à chaque frame
    const currentTarget = element.getBoundingClientRect().top + window.scrollY;
    const currentPos = start + (currentTarget - start) * ease;

    window.scrollTo(0, currentPos);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function ArticleSummaryLink() {
  const mainRef = useArticleRef();
  const [items, setItems] = useState<SummaryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const elements =
      mainRef.current.querySelectorAll<HTMLElement>("h2");
    const itemsList: SummaryItem[] = [];

    elements.forEach((el, index) => {
      itemsList.push({
        index,
        text: el.dataset.short || el.textContent || "",
        element: el,
      });
    });

    queueMicrotask(() => setItems(itemsList));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemsList.findIndex(
              (item) => item.element === entry.target,
            );
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [mainRef]);

  return (
    <div className="flex flex-col gap-2 h-full max-h-[35vh] lg:max-h-none overflow-auto no-scrollbar">
      {items.length > 0 ? (
        items.map((item) => (
          <button
            key={item.index}
            onClick={() => smoothScrollTo(item.element)}
            className={cn(
              "text-left text-[14px] leading-[140%] hover:opacity-100 text-black cursor-pointer transition-opacity duration-300 ease-in-out",
              currentIndex === item.index
                ? "opacity-100 text-polymath-display"
                : "opacity-40 text-polymath-normal font-polymath ",
            )}
          >
            {item.text}
          </button>
        ))
      ) : (
        <div className="text-sm text-gray-500">No headings</div>
      )}
    </div>
  );
}
