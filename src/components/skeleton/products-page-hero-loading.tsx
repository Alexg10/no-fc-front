export function ProductsPageHeroLoading() {
  return (
    <section className="relative w-full overflow-hidden rounded-lg">
      <div className="relative w-full aspect-video bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="w-96 h-12 bg-white/20 rounded animate-pulse mb-4" />
        <div className="w-full max-w-2xl space-y-2">
          <div className="h-6 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-white/20 rounded animate-pulse mx-auto" />
        </div>
        <div className="mt-8 px-8 py-3 bg-white/20 rounded-lg w-40 animate-pulse" />
      </div>
    </section>
  );
}
