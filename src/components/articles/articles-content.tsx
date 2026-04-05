import { ArticleCard } from "@/components/articles/article-card";
import { ArticlesPagination } from "@/components/articles/articles-pagination";
import { ArticlesParallax } from "@/components/articles/articles-parallax";
import { getArticlesPaginated } from "@/services/strapi/articleService";
import { Suspense } from "react";

interface ArticlesContentProps {
  locale: string;
  page: number;
}

export async function ArticlesContent({ locale, page }: ArticlesContentProps) {
  const {
    articles,
    page: currentPage,
    pageCount,
  } = await getArticlesPaginated(locale, page);

  if (!articles.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          No articles found
        </p>
      </div>
    );
  }

  return (
    <>
      <ArticlesParallax>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="parallax-col">
              <ArticleCard
                article={article}
                issueLabel="Issue"
                locale={locale}
              />
            </div>
          ))}
        </div>
      </ArticlesParallax>
      {pageCount > 1 && (
        <Suspense fallback={<div className="mt-8 h-14" aria-hidden />}>
          <ArticlesPagination currentPage={currentPage} pageCount={pageCount} />
        </Suspense>
      )}
    </>
  );
}
