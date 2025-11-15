import { CollectionContent } from "@/components/collection-content";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import { getCollections } from "@/lib/shopify";
import type { Metadata } from "next";
import { Suspense } from "react";

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
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
  const { handle } = await params;
  const collectionsData = await getCollections();
  const collection = collectionsData.edges.find(
    (edge) => edge.node.handle === handle
  )?.node;

  if (!collection) {
    return {
      title: "Collection introuvable | NOFC",
      description: "La collection que vous recherchez n'existe pas.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const collectionUrl = `${siteUrl}/collections/${handle}`;

  return {
    title: `${collection.title} | NOFC`,
    description: collection.description
      ? collection.description.substring(0, 160)
      : `Découvrez la collection ${collection.title} sur NOFC`,
    openGraph: {
      title: collection.title,
      description: collection.description
        ? collection.description.substring(0, 200)
        : `Découvrez la collection ${collection.title} sur NOFC`,
      url: collectionUrl,
      siteName: "NOFC",
      locale: "fr_FR",
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
  const { handle } = await params;
  const paramsSearch = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductsPageLoading />}>
        <CollectionContent handle={handle} searchParams={paramsSearch} />
      </Suspense>
    </div>
  );
}
