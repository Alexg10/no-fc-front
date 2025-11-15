import { Skeleton } from "@/components/ui/skeleton";

export function ProductsFiltersSkeleton() {
  return (
    <div className="space-y-4 mb-8 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Collection filter skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Sort filter skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Min price skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Max price skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Checkbox skeleton */}
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Button skeleton */}
      <div className="pt-2">
        <Skeleton className="h-10 w-full md:w-32" />
      </div>
    </div>
  );
}

