"use client";

import Grid from "@/components/common/grid";
import { ShareIcon } from "@/components/icons/share-icon";
import { SummaryMenuIcon } from "@/components/icons/summary-menu-icon";
import { useArticleRef } from "@/contexts/article-context";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ArticleSocialLinks } from "./article-social-links";
import { ArticleSummaryLink } from "./article-summary-link";

gsap.registerPlugin(ScrollTrigger);

export function ArticleSummary({
  article,
  mainColor,
}: {
  article: StrapiArticle;
  mainColor: ColorList;
}) {
  const mainRef = useArticleRef();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const socialsListRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [socialsIsOpen, setSocialsIsOpen] = useState(false);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

  const toggleSocials = () => {
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

  return (
    <Grid>
      <div className="absolute z-40 bg-white p-4 flex flex-col ">
        <div
          className={cn(
            "top-full right-0 w-full grid transition-all duration-300 ease-in-out",
            isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr] ",
          )}
        >
          <div className="overflow-hidden max-w-[203px]">
            <ArticleSummaryLink />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="heading-l-obviously relative leading-none text-[18px] p-4 border-2 border-black">
            <div
              ref={progressBarRef}
              className={cn(
                "absolute top-0 w-0 left-0 h-full mix-blend-difference",
                getColorClass(mainColor, "bg"),
              )}
            />
            <span
              className={cn(
                "block translate-y-[2px] mix-blend-difference relative z-10 text-nowrap",
                getColorClass(mainColor, "text"),
                mainColor === "black" ? "text-white" : "",
              )}
            >
              ISSUE N°{article.issueNumber}
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
    </Grid>
  );
}
