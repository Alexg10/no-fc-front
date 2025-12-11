import { BlockRenderer } from "@/components/common/block-renderer";
import { HeroSection } from "@/components/common/homepage/hero-section";
import { getHomepage } from "@/lib/strapi";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
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
      description: homepage.seo.metaDescription || t("metadata.home.description"),
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

// Fallback par défaut quand pas de données
function DefaultHome({ locale }: { locale: string }) {
  // Note: Pas de possibilité d'utiliser getTranslations ici car c'est un composant client
  // Donc on utilise la clé directement
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Welcome
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Discover our products
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          See Products
        </Link>
      </div>
    </div>
  );
}

// Component Server pour Blocks
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

