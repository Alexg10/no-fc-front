import { ArticleCard } from "@/components/articles/article-card";
import Grid from "@/components/common/grid/grid";
import { ButtonLink } from "@/components/ui/button-link";
import { Title } from "@/components/ui/title";
import { getOtherArticles } from "@/services/strapi/articleService";
import { getTranslations } from "next-intl/server";
interface ArticleSeeOthersProps {
  currentSlug: string;
  locale: string;
}

export async function ArticleSeeOthers({
  currentSlug,
  locale,
}: ArticleSeeOthersProps) {
  const [articles, t] = await Promise.all([
    getOtherArticles(currentSlug, 2),
    getTranslations({ locale, namespace: "article" }),
  ]);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-off-white py-12 lg:py-28 lg:pb-20">
      <Grid className="gap-y-10 lg:gap-y-12">
        <div className="col-span-full flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <Title level={2} className="text-left lg:text-[64px]">
            {t("culturalTake")}
          </Title>
          <ButtonLink href={`${locale ? `/${locale}` : ""}/articles`}>
            {t("seeMore")}
          </ButtonLink>
        </div>

        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              issueLabel={t("issue")}
              locale={locale}
            />
          ))}
        </div>
      </Grid>
    </section>
  );
}
