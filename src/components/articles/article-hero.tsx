"use client";
import { IssueNumberBadge } from "@/components/articles/issue-number-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ButtonUi } from "../ui/button-ui";

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
  const tCommon = useTranslations("common");
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedTitleColor = titleColor ?? mainColor;
  const coverRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const hero = heroRef.current;
      const container = containerRef.current;
      const cover = coverRef.current;
      const content = contentRef.current;
      if (!hero || !container || !cover || !content) return;

      const coverTween = gsap.to(cover, {
        yPercent: 5,
        scrollTrigger: {
          trigger: cover,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const heroTween = gsap.to(hero, {
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => {
            if (!container) return "+=0";
            return `+=${container.offsetHeight - window.innerHeight}`;
          },
          pin: true,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        coverTween.scrollTrigger?.kill();
        coverTween.kill();
        heroTween.scrollTrigger?.kill();
        heroTween.kill();
        gsap.set([hero, cover], { clearProps: "all" });
      };
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
    <div
      className="relative md:aspect-square overflow-hidden"
      ref={containerRef}
    >
      {article.cover && (
        <div
          className="h-full w-full md:aspect-square overflow-hidden absolute top-0 left-0"
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
        className="text-white relative h-screen z-20 w-full will-change-transform"
        ref={heroRef}
      >
        <Grid>
          <div className="relative flex items-center justify-center col-span-full  md:col-start-2 md:col-end-6 lg:col-start-3 lg:col-end-10">
            <div
              className=" text-center relative flex flex-col justify-center items-center gap-4"
              ref={contentRef}
            >
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
                  "text-l-polymath lg:mt-6 [&>p]:m-0",
                  getColorClass(resolvedTitleColor),
                )}
              />
              {isLink && (
                <ButtonUi variant="secondary">{tCommon("readArticle")}</ButtonUi>
              )}
            </div>
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
