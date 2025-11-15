import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {/* Image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex flex-col grow space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Price skeleton */}
        <div className="mt-auto pt-2">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}

