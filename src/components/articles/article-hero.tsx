import { IssueNumberBadge } from "@/components/articles/issue-number-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass } from "@/lib/utils";
import { ColorList, StrapiArticle } from "@/types/strapi/article";
import { useTranslations } from "next-intl";
import Image from "next/image";
interface ArticleHeroProps {
  article: StrapiArticle;
  mainColor: ColorList
}

export function ArticleHero({ article, mainColor }: ArticleHeroProps) {
  const t = useTranslations("article");
  return (
    <div className="relative h-full">
      {article.cover && (
        <div className="relative h-[120vh] w-full overflow-hidden">
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
      <div className=" text-white absolute bottom-[25vh] lg:bottom-[50%] translate-y-1/2 left-1/2 -translate-x-1/2 w-full">
        <Grid>
          <div className="col-span-full md:col-start-2 md:col-end-6 lg:col-start-3 lg:col-end-10 text-center flex flex-col justify-center items-center gap-4">
            <IssueNumberBadge issueNumber={article.issueNumber} issueLabel={t("issue")} />
            <h1 className={cn("heading-xl-obviously mt-2", getColorClass(mainColor))}>{article.title}</h1>
            <BlockRendererClient content={article.shortDescription} className="text-white text-l-polymath" />
          </div>
        </Grid>
      </div>
    </div>
  );
}