"use client";
import { IssueNumberBadge } from "@/components/articles/issue-number-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ArticleHeroProps {
  article: StrapiArticle;
  mainColor: ColorList;
}

export function ArticleHero({ article, mainColor }: ArticleHeroProps) {
  const t = useTranslations("article");
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!heroRef.current || !containerRef.current) return;

      const containerHeight = containerRef.current.offsetHeight;
      const titleHeight = heroRef.current.offsetHeight;
      const endValue = containerHeight - titleHeight - 100;

      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: `+=${endValue}`,
          pin: true,
          pinSpacing: false,
          scrub: 1,
        },
      });
    },
    { scope: containerRef },
  );
  return (
    <div className="relative h-[125vh]" ref={containerRef}>
      {article.cover && (
        <div className="h-[125vh] w-full overflow-hidden absolute top-0 left-0">
          <Image
            src={getStrapiImageUrl(article.cover.url)}
            alt={article.cover.alternativeText || article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      <div
        className="text-white relative pt-[25vh] z-20  w-full will-change-transform"
        ref={heroRef}
      >
        <Grid>
          <div className="col-span-full  md:col-start-2 md:col-end-6 lg:col-start-3 lg:col-end-10 text-center h-fit flex flex-col justify-center items-center gap-4">
            <IssueNumberBadge
              issueNumber={article.issueNumber}
              issueLabel={t("issue")}
            />
            <h1
              className={cn("heading-xl-obviously", getColorClass(mainColor))}
            >
              {article.title}
            </h1>
            <BlockRendererClient
              content={article.shortDescription}
              className={cn(
                "text-l-polymath lg:mt-6",
                getColorClass(mainColor),
              )}
            />
          </div>
        </Grid>
      </div>
    </div>
  );
}
