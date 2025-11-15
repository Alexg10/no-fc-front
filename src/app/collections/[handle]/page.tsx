import { CollectionContent } from "@/components/collection-content";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
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
