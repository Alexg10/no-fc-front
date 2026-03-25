"use client";

import { useArticleRef } from "@/contexts/article-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Heading {
  index: number;
  text: string;
  element: HTMLHeadingElement;
}

export function ArticleSummaryLink() {
  const mainRef = useArticleRef();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const h2Elements = mainRef.current.querySelectorAll("h2");
    const headingsList: Heading[] = [];

    h2Elements.forEach((h2, index) => {
      headingsList.push({
        index,
        text: h2.textContent || "",
        element: h2,
      });
    });

    queueMicrotask(() => setHeadings(headingsList));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = headingsList.findIndex(
              (h) => h.element === entry.target,
            );
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      { threshold: 0.2 },
    );

    h2Elements.forEach((h2) => observer.observe(h2));

    return () => {
      h2Elements.forEach((h2) => observer.unobserve(h2));
      observer.disconnect();
    };
  }, [mainRef]);

  return (
    <div className="flex flex-col gap-2 h-full max-h-[35vh] lg:max-h-none overflow-auto no-scrollbar">
      {headings.length > 0 ? (
        headings.map((heading) => (
          <button
            key={heading.index}
            onClick={() =>
              heading.element.scrollIntoView({ behavior: "smooth" })
            }
            className={cn(
              "text-left text-[14px] leading-[140%] hover:opacity-100 text-black cursor-pointer transition-opacity duration-300 ease-in-out",
              currentIndex === heading.index
                ? "opacity-100 text-polymath-display"
                : "opacity-40 text-polymath-normal font-polymath ",
            )}
          >
            {heading.text}
          </button>
        ))
      ) : (
        <div className="text-sm text-gray-500">No headings</div>
      )}
    </div>
  );
}
