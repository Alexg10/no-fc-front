"use client";

import { ShareIcon } from "@/components/icons/share-icon";
import { SummaryMenuIcon } from "@/components/icons/summary-menu-icon";
import { useArticleRef } from "@/contexts/article-context";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList } from "@/types/strapi/article";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ArticleSocialLinks } from "./article-social-links";
import { ArticleSummaryLink } from "./article-summary-link";

gsap.registerPlugin(ScrollTrigger);

export function ArticleSummary({
  issueNumber,
  mainColor,
}: {
  issueNumber: string;
  mainColor: ColorList;
}) {
  const mainRef = useArticleRef();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const socialsListRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [socialsIsOpen, setSocialsIsOpen] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const toggleSummary = () => {
    if (socialsIsOpen) {
      setSocialsIsOpen(false);
    }
    setIsOpen(!isOpen);
  };

  const toggleSocials = () => {
    if (isOpen) {
      setIsOpen(false);
    }
    if (socialsListRef.current) {
      gsap.to(socialsListRef.current, {
        width: socialsIsOpen ? "0%" : "100%",
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
    setSocialsIsOpen(!socialsIsOpen);
  };

  useEffect(() => {
    if (!mainRef.current || !progressBarRef.current) return;

    gsap.to(progressBarRef.current, {
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      },
      ease: "power2.inOut",
    });
  }, [mainRef]);

  useGSAP(
    () => {
      if (!summaryRef.current || !mainRef.current) return;

      gsap.to(summaryRef.current, {
        scrollTrigger: {
          trigger: summaryRef.current,
          start: "top center",
          end: `+=${mainRef.current.offsetHeight}`,
          pin: true,
          pinSpacing: false,
        },
      });
    },
    { scope: summaryRef },
  );

  return (
    <div className="max-w-[1424px] mx-auto w-full px-4">
      <div
        className="absolute z-40 flex flex-col items-start justify-end"
        ref={summaryRef}
      >
        <div className="bg-white p-4 w-full!important h-full!important">
          <div
            className={cn(
              "top-full bg-white right-0 w-full grid transition-all duration-300 ease-in-out",
              isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr] ",
            )}
          >
            <div className="overflow-hidden max-w-[203px] text-polymath">
              <ArticleSummaryLink />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="heading-l-obviously relative leading-none text-[18px] p-4 border-2 border-black">
              <div
                ref={progressBarRef}
                className={cn(
                  "absolute top-0 w-0 left-0 h-full ",
                  getColorClass(mainColor, "bg"),
                  mainColor === "black" || mainColor === "white"
                    ? "mix-blend-difference"
                    : "",
                )}
              />
              <span
                className={cn(
                  "block translate-y-[2px] relative z-10 text-nowrap",
                  mainColor === "black" ? "text-white" : "",
                  mainColor === "black" || mainColor === "white"
                    ? "mix-blend-difference"
                    : "",
                )}
              >
                ISSUE N°{issueNumber}
              </span>
            </div>
            <div className="heading-l-obviously flex text-[18px]">
              <button
                className="border-2 border-black p-4 border-r-0 cursor-pointer"
                onClick={toggleSummary}
              >
                <SummaryMenuIcon />
              </button>
              <div
                className={cn(
                  "border-black p-4 border-2 flex items-center overflow-hidden transition-all duration-300 ease-in-out",
                  socialsIsOpen ? "w-[190px]" : "w-[58px]",
                )}
              >
                <button className="cursor-pointer" onClick={toggleSocials}>
                  <ShareIcon />
                </button>
                <ArticleSocialLinks className="transition-all duration-300 ease-in-out" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
