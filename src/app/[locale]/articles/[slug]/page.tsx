import { ArticleAlternateLinks } from "@/components/articles/article-alternate-links";
import { ArticleHero } from "@/components/articles/article-hero";
import { ArticleMainContent } from "@/components/articles/article-main-content";
import { ArticlePageWrapper } from "@/components/articles/article-page-wrapper";
import { ArticleSeeOthers } from "@/components/articles/article-see-others";
import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getArticleBySlug } from "@/services/strapi/articleService";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface ArticlePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  if (!article) {
    return {
      title: t("articles.title"),
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleUrl = `${siteUrl}/${locale}/articles/${slug}`;

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;

  return {
    title,
    description,
    keywords: article.seo?.keywords,
    openGraph: {
      title,
      description,
      url: articleUrl,
      type: "article",
      locale: locale === "en" ? "en_US" : "fr_FR",
      ...(article.cover && {
        images: [
          {
            url: getStrapiImageUrl(article.cover.url),
            alt: article.cover.alternativeText || article.title,
          },
        ],
      }),
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
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
