"use client";

import { ShareIcon } from "@/components/icons/share-icon";
import { SummaryMenuIcon } from "@/components/icons/summary-menu-icon";
import { useArticleRef } from "@/contexts/article-context";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ArticleSocialLinks } from "./article-social-links";
import { ArticleSummaryLink } from "./article-summary-link";

gsap.registerPlugin(ScrollTrigger);

const PIN_END_OFFSET = 250;

function getPinEndValue(
  main: HTMLElement | null,
  summary: HTMLElement | null,
): string {
  if (!main || !summary) return "+=0";
  const mainHeight = main.offsetHeight;
  const summaryOffsetFromMain =
    summary.getBoundingClientRect().top - main.getBoundingClientRect().top;
  return `+=${Math.max(
    0,
    mainHeight - summaryOffsetFromMain - PIN_END_OFFSET,
  )}`;
}

export function ArticleSummary({
  article,
  issueNumber,
  mainColor,
}: {
  article?: StrapiArticle | null;
  issueNumber: string;
  mainColor: ColorList;
}) {
  const mainRef = useArticleRef();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const socialsListRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [socialsIsOpen, setSocialsIsOpen] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { isUnderDesktop } = useBreakpoints();

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
    if (isUnderDesktop) {
      setSocialsIsOpen(!socialsIsOpen);
    }
  };

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl || !progressBarRef.current) return;

    gsap.to(progressBarRef.current, {
      scrollTrigger: {
        trigger: mainEl,
        start: "top 75%",
        end: "bottom 50%",
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

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(mainEl);

    return () => {
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === mainEl) st.kill();
      });
    };
  }, [mainRef]);

  useEffect(() => {
    const summaryEl = summaryRef.current;
    const mainEl = mainRef.current;
    if (!summaryEl || !mainEl) return;

    const timeoutId = setTimeout(() => {
      gsap.to(summaryEl, {
        scrollTrigger: {
          trigger: summaryEl,
          start: isUnderDesktop ? "bottom bottom-=16px" : "center center",
          end: () => getPinEndValue(mainEl, summaryEl),
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, 0);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === summaryEl) st.kill();
      });
    };
  }, [mainRef, summaryRef, isUnderDesktop]);

  return (
    <div className="max-w-[1424px] mx-auto w-full px-4">
      <div
        className="absolute z-40 flex flex-col items-start justify-end top-5 bg-white"
        ref={summaryRef}
      >
        <div className="p-2 lg:p-4 w-full!important h-full!important bg-white">
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
          <div className="flex gap-2 bg-white overflow-hidden">
            {isUnderDesktop && (
              <ArticleSocialLinks
                className={cn(
                  "absolute z-0 top-0 left-0 w-full bg-white  transition-all duration-300 ease-in-out",
                  socialsIsOpen ? "-translate-y-full" : "translate-y-0",
                )}
                articleTitle={article?.title}
                articleDescription={article?.shortDescription}
              />
            )}
            <div className="heading-l-obviously relative z-10 leading-none text-[18px] p-4 border-2 border-black">
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
                  mainColor === "black" ? "text-white" : "text-black",
                  mainColor === "black" || mainColor === "white"
                    ? "mix-blend-difference text-white"
                    : "",
                )}
              >
                ISSUE N°{issueNumber}
              </span>
            </div>
            <div className="heading-l-obviously bg-white relative z-10 flex text-[18px]">
              <button
                className="border-2 border-black p-4 border-r-0 cursor-pointer"
                onClick={toggleSummary}
              >
                <SummaryMenuIcon />
              </button>
              <div
                className={cn(
                  "border-black p-4 border-2  flex items-center overflow-hidden transition-all duration-300 ease-in-out",
                  socialsIsOpen ? "lg:w-[190px]" : "lg:w-[58px]",
                )}
              >
                <button className="cursor-pointer" onClick={toggleSocials}>
                  <ShareIcon />
                </button>
                {!isUnderDesktop && (
                  <ArticleSocialLinks
                    className="bg-white transition-all duration-300 ease-in-out"
                    articleTitle={article?.title}
                    articleDescription={article?.shortDescription}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
