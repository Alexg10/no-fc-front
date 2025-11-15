import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-black dark:text-zinc-50">404</h1>
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Produit non trouvé
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Le produit que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        <Link
          href="/"
          className="inline-block bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

