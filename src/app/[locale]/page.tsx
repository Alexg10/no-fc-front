import { ArticleHero } from "@/components/articles/article-hero";
import { HomeBlocks } from "@/components/common/homepage/home-blocks";
import { LogoIcons } from "@/components/icons/logo-icons";
import { getLastArticle } from "@/services/strapi/articleService";
import { getHomepage } from "@/services/strapi/homepageService";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Marquee from "react-fast-marquee";

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
    return {
      title: homepage.seo.metaTitle || t("metadata.home.title"),
      description:
        homepage.seo.metaDescription || t("metadata.home.description"),
      keywords: homepage.seo.keywords,
      openGraph: {
        title: homepage.seo.metaTitle || t("metadata.home.title"),
        description:
          homepage.seo.metaDescription || t("metadata.home.description"),
        type: "website",
        locale: locale === "en" ? "en_US" : "fr_FR",
      },
    };
  }

  return {
    title: t("metadata.home.title"),
    description: t("metadata.home.description"),
    openGraph: {
      title: t("metadata.home.title"),
      description: t("metadata.home.description"),
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
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
      />

      <Suspense fallback={<BlockSkeleton />}>
        {homepage?.blocks && (
          <HomeBlocks blocks={homepage?.blocks} locale={locale} />
        )}
      </Suspense>
      <Marquee
        autoFill={true}
        className="bg-black text-white text-nowrap gap-4"
      >
        <div className="flex items-center justify-center gap-4 heading-s-obviously lg:text-[24px] ">
          <div className="">Free shipping on all eligible orders</div>
          <LogoIcons className="w-6" />
          <div className="">Refund guaranteed within 15 days</div>
          <LogoIcons className="w-6" />
        </div>
      </Marquee>
    </main>
  );
}
