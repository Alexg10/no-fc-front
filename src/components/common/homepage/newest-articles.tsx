import { ArticleCard } from "@/components/articles/article-card";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { getPreviousTwoArticles } from "@/services/strapi/articleService";
import { StrapiHomepageNewestArticles } from "@/types/strapi";
import Link from "next/link";
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
    getPreviousTwoArticles(),
    getTranslations({ locale: locale || "fr", namespace: "article" }),
  ]);

  return (
    <Grid>
      <div className="col-span-full">
        {title && <BlockRendererClient content={title} />}
        <Link href={`/${locale}/articles`}>View all articles</Link>
      </div>
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
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
