"use client";
import { IssueNumberBadge } from "@/components/articles/issue-number-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { BREAKPOINTS } from "@/hooks/useBreakpoints";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ArticleHeroProps {
  article: StrapiArticle;
  mainColor: ColorList;
  isLink?: boolean;
  titleColor: ColorList | null;
}

export function ArticleHero({
  article,
  mainColor,
  isLink = false,
  titleColor,
}: ArticleHeroProps) {
  const t = useTranslations("article");
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedTitleColor = titleColor ?? mainColor;
  const coverRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const hero = heroRef.current;
      const container = containerRef.current;
      const cover = coverRef.current;
      if (!hero || !container || !cover) return;

      gsap.to(cover, {
        yPercent: 13,
        scrollTrigger: {
          trigger: cover,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(hero, {
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => {
            if (!container || !hero) return "+=0";
            const isUnderTablet =
              typeof window !== "undefined" &&
              window.innerWidth < BREAKPOINTS.TABLET;
            const offset = isUnderTablet ? 40 : 100;
            return `+=${container.offsetHeight - hero.offsetHeight - offset}`;
          },
          pin: true,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);
  const articleHref = article.slug ? `/articles/${article.slug}` : "#";

  const heroContent = (
    <div className="relative h-[125vh] overflow-hidden" ref={containerRef}>
      {article.cover && (
        <div
          className="h-[125vh] w-full overflow-hidden absolute top-0 left-0"
          ref={coverRef}
        >
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
              className={cn(
                "heading-xl-obviously leading-[85%]",
                getColorClass(resolvedTitleColor),
              )}
            >
              {article.title}
            </h1>
            <BlockRendererClient
              content={article.shortDescription}
              className={cn(
                "text-l-polymath lg:mt-6",
                getColorClass(resolvedTitleColor),
              )}
            />
          </div>
        </Grid>
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href={articleHref} className="block">
        {heroContent}
      </Link>
    );
  }

  return heroContent;
}
