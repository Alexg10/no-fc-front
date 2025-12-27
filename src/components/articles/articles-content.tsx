import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getArticles } from "@/services/strapi/articleService";
import Image from "next/image";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Articles</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Explore our latest articles and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug || article.id}`}
            className="group"
          >
            <div className="bg-white dark:bg-zinc-900  overflow-hidden ">
              {article.cover && (
                <div className="relative w-full aspect-2/3 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={getStrapiImageUrl(article.cover.url)}
                    alt={article.cover.alternativeText || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="pt-4">
                <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
