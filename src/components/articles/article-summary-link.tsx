"use client";

import { useArticleRef } from "@/contexts/article-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
}

export function ArticleSummaryLink() {
  const mainRef = useArticleRef();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isCurrentSection, setIsCurrentSection] = useState<string | null>(null);
  useEffect(() => {
    if (!mainRef.current) return;

    const h2Elements = mainRef.current.querySelectorAll("h2");
    const headingsList: Heading[] = [];

    h2Elements.forEach((h2, index) => {
      const id = h2.id || `heading-${index}`;
      h2.id = id;
      headingsList.push({
        id,
        text: h2.textContent || "",
      });
    });

    queueMicrotask(() => setHeadings(headingsList));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCurrentSection(entry.target.id);
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

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-4 max-h-[25vh] overflow-y-auto">
      {headings.length > 0 ? (
        headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={cn(
              "text-left text-[14px] leading-[140%]hover:opacity-100 text-black cursor-pointer",
              isCurrentSection === heading.id
                ? "opacity-100"
                : "opacity-40 text-polymath  ",
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
