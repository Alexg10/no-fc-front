import { ProductsFiltersSkeleton } from "./products-filters-skeleton";
import { ProductsGridSkeleton } from "./products-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsPageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-64 mb-8" />

      {/* Filters skeleton */}
      <ProductsFiltersSkeleton />

      {/* Products grid skeleton */}
      <ProductsGridSkeleton count={12} />
    </div>
  );
}

