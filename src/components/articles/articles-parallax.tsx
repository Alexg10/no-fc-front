"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ArticlesParallaxProps {
  children: React.ReactNode;
}

export function ArticlesParallax({ children }: ArticlesParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cols = containerRef.current.querySelectorAll(".parallax-col");

      if (cols.length < 1) return;

      cols.forEach((col, index) => {
        const isOdd = (index + 1) % 2 === 1;

        gsap.fromTo(
          col,
          { yPercent: 0 },
          {
            yPercent: isOdd ? -10 : 10,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 25%",
              end: "bottom 50%",
              scrub: 1.5,
            },
          },
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
