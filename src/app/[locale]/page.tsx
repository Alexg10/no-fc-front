import { ArticleHero } from "@/components/articles/article-hero";
import { HomeBlocks } from "@/components/common/homepage/home-blocks";
import { PreFooterMarquee } from "@/components/common/pre-footer-marquee";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getLastArticle } from "@/services/strapi/articleService";
import { getHomepage } from "@/services/strapi/homepageService";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Skeleton pour Block
function BlockSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
    </div>
  );
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const homepage = await getHomepage(locale);

  if (homepage?.seo) {
    const title = homepage.seo.metaTitle || t("metadata.home.title");
    const description =
      homepage.seo.metaDescription || t("metadata.home.description");

    const ogImage = homepage.seo.metaImage
      ? {
          url: getStrapiImageUrl(homepage.seo.metaImage.url),
          alt: homepage.seo.metaImage.alternativeText || title,
          width: homepage.seo.metaImage.width,
          height: homepage.seo.metaImage.height,
        }
      : undefined;

    return {
      title,
      description,
      keywords: homepage.seo.keywords,
      openGraph: {
        title,
        description,
        type: "website",
        locale: locale === "en" ? "en_US" : "fr_FR",
        ...(ogImage && { images: [ogImage] }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage && { images: [ogImage.url] }),
      },
    };
  }

  const defaultTitle = t("metadata.home.title");
  const defaultDescription = t("metadata.home.description");

  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const homepage = await getHomepage(locale);

  let displayArticle = homepage?.heroArticle?.article;

  if (!displayArticle) {
    const lastArticle = await getLastArticle(locale);
    if (lastArticle) {
      displayArticle = lastArticle;
    }
  }

  if (!displayArticle) {
    return null;
  }

  return (
    <main className="min-h-screen bg-off-white">
      <ArticleHero
        article={displayArticle}
        mainColor={displayArticle.mainColor}
        isLink={true}
        titleColor={displayArticle.titleColor}
      />

      <Suspense fallback={<BlockSkeleton />}>
        {homepage?.blocks && (
          <HomeBlocks blocks={homepage?.blocks} locale={locale} />
        )}
      </Suspense>
      <PreFooterMarquee locale={locale} />
    </main>
  );
}
