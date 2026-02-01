"use client";

import Grid from "@/components/common/grid";
import { ShareIcon } from "@/components/icons/share-icon";
import { SummaryMenuIcon } from "@/components/icons/summary-menu-icon";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { useArticleRef } from "@/contexts/article-context";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";

export function ArticleSummary({
  article,
  mainColor,
}: {
  article: StrapiArticle;
  mainColor: ColorList;
}) {
  const mainRef = useArticleRef();

  return (
    <Grid>
      <div className="fixed top-1/2 z-40 bg-white p-4 flex gap-2">
        <div className="heading-l-obviously relative leading-none text-[18px]  p-4 border-2 border-black">
          <ScrollProgress
            containerRef={mainRef.current}
            className={cn(
              "absolute top-0 bg-black h-full mix-blend-difference",
              getColorClass(mainColor, "bg"),
            )}
          />
          <span
            className={cn(
              "block translate-y-[2px] mix-blend-difference",
              getColorClass(mainColor, "text"),
              mainColor === "black" ? "text-white" : "",
            )}
          >
            ISSUE N°{article.issueNumber}
          </span>
        </div>
        <div className="heading-l-obviously flex text-[18px">
          <button className="border-2 border-black p-4 border-r-0">
            <SummaryMenuIcon />
          </button>
          <button className=" border-black p-4 border-2">
            <ShareIcon />
          </button>
        </div>
      </div>
    </Grid>
  );
}
