import { BlockRenderer } from "@/components/common/block-renderer";
import { HeroSection } from "@/components/common/homepage/hero-section";
import { getHomepage } from "@/lib/strapi";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
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

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const homepage = await getHomepage(locale);

  // Si pas de données Strapi, afficher une page par défaut
  if (!homepage) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            {t("homepage.welcome")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            {t("homepage.subtitle")}
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {t("common.seeProducts")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {homepage.hero && <HeroSection hero={homepage.hero} />}
      {homepage.blocks && homepage.blocks.length > 0 && (
        <div className="space-y-12">
          {homepage.blocks.map((block, index) => (
            <BlockRenderer key={block.id || index} block={block} />
          ))}
        </div>
      )}
    </main>
  );
}

