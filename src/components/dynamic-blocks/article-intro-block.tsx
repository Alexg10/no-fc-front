import { ArticleSummary } from "@/components/articles/article-summary";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { cn, getColorClass } from "@/lib/utils";
import type { StrapiArticleIntro } from "@/types/strapi";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface ArticleIntroBlockProps {
  block: StrapiArticleIntro;
  mainColor: ColorList;
  issueNumber: string;
  article?: StrapiArticle | null;
}

export function ArticleIntroBlock({
  block,
  mainColor,
  issueNumber,
  article,
}: ArticleIntroBlockProps) {
  return (
    <div
      className={cn(
        "py-16 pb-14 mb-25 relative lg:py-32 heading-s-polymath-display lg:mb-31",
        getColorClass(mainColor, "bg"),
        mainColor === "black" && "text-white",
      )}
    >
      <div
        className="absolute top-[-50px] left-0 w-full h-[100px] bg-no-repeat"
        style={{
          backgroundImage: `url("/images/article/article_ripped.webp")`,
          backgroundSize: "auto 70%",
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-darken opacity-90 pointer-events-none"
        style={{
          backgroundImage: `url(/images/article/intro_noise.webp)`,
        }}
      />
      <Grid>
        <div className="col-span-full lg:col-start-3 lg:col-end-11">
          <BlockRendererClient
            content={block.description as BlocksContent}
            className="[&>p]:heading-s-polymath-display"
          />
        </div>
      </Grid>
      <div
        className="absolute bottom-[-52px] left-0 w-full h-[100px] bg-no-repeat"
        style={{
          backgroundImage: `url("/images/article/article_ripped.webp")`,
          backgroundSize: "auto 70%",
        }}
      />
      <ArticleSummary
        article={article}
        mainColor={mainColor}
        issueNumber={issueNumber}
      />
    </div>
  );
}
