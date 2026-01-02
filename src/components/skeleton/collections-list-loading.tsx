export function CollectionsListLoading() {
  return (
    <section className="py-12">
      <div className="space-y-8">
        <div>
          <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow"
            >
              <div className="w-full aspect-square bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
