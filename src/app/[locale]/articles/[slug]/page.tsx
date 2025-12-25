import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import Grid from "@/components/common/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getArticleBySlug } from "@/services/strapi/articleService";
import Image from "next/image";
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
    <main className="min-h-screen">
      {article.cover && (
        <div className="relative h-[90vh] w-full overflow-hidden">
          <Image
            src={getStrapiImageUrl(article.cover.url)}
            alt={article.cover.alternativeText || article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <section className="bg-black text-white">
        <Grid>
          <div className="col-span-full">
            <h1 className="text-4xl font-bold">{article.title}</h1>
          </div>
        </Grid>
      </section>
      <Grid>
        <article className="col-span-full space-y-8">
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
        </article>
      </Grid>
    </main>
  );
}
