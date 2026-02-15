import { CollectionContent } from "@/components/collection-content";
import { PageHeader } from "@/components/common/page-header";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import { getCollections } from "@/lib/shopify";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import Grid from "@/components/common/grid";
import { PreFooterMarquee } from "@/components/common/pre-footer-marquee";
import { CollectionsSection } from "@/components/products/collections-section";
import { CollectionsListLoading } from "@/components/skeleton/collections-list-loading";
import { getGeneral } from "@/services/strapi/generalService";
interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{
    page?: string;
    after?: string;
    before?: string;
    sort?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const tMetadata = await getTranslations({ locale, namespace: "metadata" });

  const collectionsData = await getCollections();
  const collection = collectionsData.edges.find(
    (edge) => edge.node.handle === handle,
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
  const general = await getGeneral(locale);
  const selectedCollections = general?.selectedCollections;
  return (
    <section className="bg-off-white">
      <PageHeader title={`${handle}`} marquee="SHOP" />
      <main className=" pb-20 lg:pb-27">
        <Grid>
          <div className="col-span-full">
            <Suspense fallback={<CollectionsListLoading />}>
              <CollectionsSection collections={selectedCollections} />
            </Suspense>
          </div>
        </Grid>
        <hr className="border-black" />
        <Grid>
          <div className="col-span-full pt-6">
            <Suspense fallback={<ProductsPageLoading />}>
              <CollectionContent
                locale={locale}
                handle={handle}
                searchParams={paramsSearch}
              />
            </Suspense>
          </div>
        </Grid>
      </main>
      <PreFooterMarquee />
    </section>
  );
}
