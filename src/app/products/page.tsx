import { ProductsContent } from "@/components/products-content";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import { Suspense } from "react";

interface ProductsPageProps {
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

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductsPageLoading />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
