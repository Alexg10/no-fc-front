export function BlockSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4">
        {/* Ligne 1 - titre */}
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg w-3/4 animate-pulse" />

        {/* Ligne 2-3 - contenu */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-lg w-5/6 animate-pulse" />
        </div>

        {/* Ligne 4 - bouton */}
        <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg w-40 animate-pulse mt-4" />
      </div>
    </div>
  );
}
