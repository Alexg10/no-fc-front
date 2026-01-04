import { CollectionContent } from "@/components/collection-content";
import { PageHeader } from "@/components/common/page-header";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import { getCollections } from "@/lib/shopify";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{
    page?: string;
    after?: string;
    before?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const tMetadata = await getTranslations({ locale, namespace: "metadata" });
  const collectionsData = await getCollections();
  const collection = collectionsData.edges.find(
    (edge) => edge.node.handle === handle
  )?.node;

  if (!collection) {
    return {
      title: tMetadata("collections.notFoundTitle"),
      description: tMetadata("collections.notFoundDescription"),
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const collectionUrl = `${siteUrl}/${locale}/collections/${handle}`;

  const defaultDescription = tMetadata("collections.discoverCollection", {
    title: collection.title,
  });

  return {
    title: `${collection.title} | NOFC`,
    description: collection.description
      ? collection.description.substring(0, 160)
      : defaultDescription,
    openGraph: {
      title: collection.title,
      description: collection.description
        ? collection.description.substring(0, 200)
        : defaultDescription,
      url: collectionUrl,
      siteName: "NOFC",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "website",
    },
    alternates: {
      canonical: collectionUrl,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle, locale } = await params;
  const paramsSearch = await searchParams;

  return (
    <>
      <PageHeader title={`Collection ${handle}`} marqueeLabel="Shop" />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductsPageLoading />}>
          <CollectionContent
            locale={locale}
            handle={handle}
            searchParams={paramsSearch}
          />
        </Suspense>
      </main>
    </>
  );
}
