import { ArticleAlternateLinks } from "@/components/articles/article-alternate-links";
import { ArticleHero } from "@/components/articles/article-hero";
import { ArticleMainContent } from "@/components/articles/article-main-content";
import { ArticlePageWrapper } from "@/components/articles/article-page-wrapper";
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
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    return null;
  }

  const mainColor = article?.mainColor;
  const titleColor = article?.titleColor;
  const issueNumber = article?.issueNumber;
  return (
    <ArticlePageWrapper>
      <ArticleAlternateLinks
        currentSlug={slug}
        currentLocale={locale}
        localizations={article.localizations ?? []}
      />
      <article className="min-h-[120dvh] bg-off-white overflow-hidden article-content-wrapper">
        <ArticleHero
          article={article}
          mainColor={mainColor}
          titleColor={titleColor}
        />
        <ArticleMainContent>
          {article.blocks && article.blocks.length > 0 && (
            <div>
              {article.blocks.map((block, index) => (
                <Suspense
                  key={`${block.__component}-${index}`}
                  fallback={<BlockSkeleton />}
                >
                  <BlockRenderer
                    article={article}
                    block={block}
                    locale={locale}
                    mainColor={mainColor}
                    issueNumber={issueNumber}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </ArticleMainContent>
      </article>
      <Suspense fallback={<BlockSkeleton />}>
        <ArticleSeeOthers currentSlug={slug} locale={locale} />
      </Suspense>
    </ArticlePageWrapper>
  );
}
