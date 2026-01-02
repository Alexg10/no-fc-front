import { CollectionsSection } from "@/components/products/collections-section";
import { ProductsContent } from "@/components/products/products-content";
import { ProductsPageHeroSection } from "@/components/products/products-page-hero-section";
import { CollectionsListLoading } from "@/components/skeleton/collections-list-loading";
import { ProductsPageHeroLoading } from "@/components/skeleton/products-page-hero-loading";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import { getProductsPage } from "@/services/strapi/productsPageService";
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
  const productsPageData = await getProductsPage();

  return (
    <div className="space-y-12">
      <Suspense fallback={<CollectionsListLoading />}>
        <CollectionsSection collections={productsPageData?.collections} />
      </Suspense>
      <Suspense fallback={<ProductsPageHeroLoading />}>
        <ProductsPageHeroSection hero={productsPageData?.hero} />
      </Suspense>

      <div className="container mx-auto px-4">
        <Suspense fallback={<ProductsPageLoading />}>
          <ProductsContent locale={locale} searchParams={paramsSearch} />
        </Suspense>
      </div>
    </div>
  );
}
