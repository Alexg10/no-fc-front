import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductsGridSkeletonProps {
  count?: number;
}

export function ProductsGridSkeleton({ count = 12 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

