import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CollectionNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Collection introuvable
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          La collection que vous recherchez n&apos;existe pas ou a été supprimée.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/products">Voir tous les produits</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

