import { BlockRenderer } from "@/components/common/block-renderer";
import { HeroSection } from "@/components/common/homepage/hero-section";
import { getHomepage } from "@/lib/strapi";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Skeleton pour Hero
function HeroSkeleton() {
  return (
    <div className="w-full h-96 bg-linear-to-b from-gray-200 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 animate-pulse" />
  );
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

// Component Server pour Hero
async function HomeHero({ locale }: { locale: string }) {
  const homepage = await getHomepage(locale);

  if (!homepage?.hero) {
    return null;
  }

  return <HeroSection hero={homepage.hero} />;
}

async function HomeBlocks({ locale }: { locale: string }) {
  const homepage = await getHomepage(locale);

  if (!homepage?.blocks || homepage.blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {homepage.blocks.map((block, index) => (
        <BlockRenderer key={block.id || index} block={block} />
      ))}
    </div>
  );
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <HomeHero locale={locale} />
      </Suspense>

      <Suspense fallback={<BlockSkeleton />}>
        <HomeBlocks locale={locale} />
      </Suspense>
    </main>
  );
}
