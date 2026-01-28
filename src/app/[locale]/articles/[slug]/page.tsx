import { ArticleHero } from "@/components/articles/article-hero";
import { ArticleSeeOthers } from "@/components/articles/article-see-others";
import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { getArticleBySlug } from "@/services/strapi/articleService";
import { Suspense } from "react";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return null;
  }

  const mainColor = article?.mainColor;

  return (
    <article className="min-h-[120dvh] bg-off-white">
      <ArticleHero article={article} mainColor={mainColor} />
      <main>
        {article.blocks && article.blocks.length > 0 && (
          <div>
            {article.blocks.map((block, index) => (
              <Suspense
                key={`${block.__component}-${index}`}
                fallback={<BlockSkeleton />}
              >
                <BlockRenderer
                  block={block}
                  locale={locale}
                  mainColor={mainColor}
                />
              </Suspense>
            ))}
          </div>
        )}
        <Suspense fallback={<BlockSkeleton />}>
          <ArticleSeeOthers currentSlug={slug} locale={locale} />
        </Suspense>
      </main>
    </article>
  );
}
