import { HeroArticle } from "@/components/common/homepage/hero-article";
import { HomeBlocks } from "@/components/common/homepage/home-blocks";
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
  const homepage = await getHomepage();

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

export default async function Home({
  params,
}: HomePageProps) {
  const { locale } = await params;
  const homepage = await getHomepage();

  return (
    <main className="min-h-screen">
      <HeroArticle article={homepage?.heroArticle?.article} />

      <Suspense fallback={<BlockSkeleton />}>
        {homepage?.blocks && (
          <HomeBlocks blocks={homepage?.blocks} locale={locale} />
        )}
      </Suspense>
    </main>
  );
}
