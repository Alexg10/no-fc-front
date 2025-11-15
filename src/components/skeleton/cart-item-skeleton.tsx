import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      {/* Image skeleton */}
      <Skeleton className="shrink-0 w-20 h-20 rounded-lg" />

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* Controls skeleton */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

