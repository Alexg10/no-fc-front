import { ArticleCard } from "@/components/articles/article-card";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { ButtonLink } from "@/components/ui/button-link";
import { getPreviousTwoArticles } from "@/services/strapi/articleService";
import { StrapiHomepageNewestArticles } from "@/types/strapi";
import { getTranslations } from "next-intl/server";

async function NewestArticles({
  block,
  locale,
}: {
  block: StrapiHomepageNewestArticles;
  locale?: string;
}) {
  const title = block.title;
  const [articles, t] = await Promise.all([
    getPreviousTwoArticles(locale || "fr"),
    getTranslations({ locale: locale || "fr", namespace: "article" }),
  ]);

  return (
    <Grid className="gap-y-10">
      <div className="col-span-full flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {title && (
          <BlockRendererClient
            content={title}
            className="heading-m-obviously! [&>p]:heading-m-obviously!"
          />
        )}
        <ButtonLink href={`/${locale}/articles`}>{t("seeMore")}</ButtonLink>
      </div>
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            locale={locale}
            issueLabel={t("issue")}
          />
        ))}
      </div>
    </Grid>
  );
}

export { NewestArticles };
