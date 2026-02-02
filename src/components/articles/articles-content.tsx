import { ArticleCard } from "@/components/articles/article-card";
import { getArticles } from "@/services/strapi/articleService";

interface ArticlesContentProps {
  locale: string;
}

export async function ArticlesContent({ locale }: ArticlesContentProps) {
  const articles = await getArticles();

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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          issueLabel="Issue"
          locale={locale}
        />
      ))}
    </div>
  );
}
