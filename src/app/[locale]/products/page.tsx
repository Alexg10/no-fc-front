import { ArticleCollection } from "@/components/articles/article-collection";
import { ProductsContent } from "@/components/products/products-content";
import { ArticleCollectionLoading } from "@/components/skeleton/article-collection-loading";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    after?: string;
    before?: string;
    collection?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    available?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("products.title"),
    description: t("products.description"),
    openGraph: {
      title: t("products.title"),
      description: t("products.description"),
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/${locale}/products`,
    },
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const paramsSearch = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ArticleCollectionLoading limit={3} />}>
        <ArticleCollection collectionHandle="best-sellers" limit={4} />
      </Suspense>
      <Suspense fallback={<ProductsPageLoading />}>
        <ProductsContent locale={locale} searchParams={paramsSearch} />
      </Suspense>
    </div>
  );
}
