import { BlockRenderer } from "@/components/common/block-renderer";
import { HeroSection } from "@/components/common/homepage/hero-section";
import { getHomepage } from "@/lib/strapi";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  console.log(homepage);
  if (homepage?.seo) {
    return {
      title: homepage.seo.metaTitle || "Accueil | NOFC",
      description: homepage.seo.metaDescription || "Bienvenue sur NOFC",
      keywords: homepage.seo.keywords,
      openGraph: {
        title: homepage.seo.metaTitle || "NOFC - Votre boutique en ligne",
        description:
          homepage.seo.metaDescription ||
          "Découvrez notre sélection de produits de qualité",
        type: "website",
        locale: "fr_FR",
      },
    };
  }

  return {
    title: "Accueil | NOFC",
    description:
      "Bienvenue sur NOFC, votre boutique en ligne de produits de qualité. Découvrez notre sélection et trouvez ce qui vous convient.",
    openGraph: {
      title: "NOFC - Votre boutique en ligne",
      description: "Découvrez notre sélection de produits de qualité",
      type: "website",
      locale: "fr_FR",
    },
  };
}

export default async function Home() {
  const homepage = await getHomepage();

  // Si pas de données Strapi, afficher une page par défaut
  if (!homepage) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            Bienvenue sur NOFC
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Votre boutique en ligne de produits de qualité
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Voir les produits
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
