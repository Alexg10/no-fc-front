import { ArticleHero } from "@/components/articles/article-hero";
import { BlockRenderer } from "@/components/common/block-renderer";
import Grid from "@/components/common/grid";
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


  return (
    <article className="min-h-[120dvh]">
      <ArticleHero article={article} />
      <Grid>
        <main className="col-span-full space-y-8">
          {article.blocks && article.blocks.length > 0 && (
            <div>
              {article.blocks.map((block, index) => (
                <Suspense
                  key={`${block.__component}-${index}`}
                  fallback={<BlockSkeleton />}
                >
                  <BlockRenderer block={block} locale={locale} />
                </Suspense>
              ))}
            </div>
          )}
        </main>
      </Grid>
    </article>
  );
}
