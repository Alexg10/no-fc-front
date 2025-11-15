"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ShopifyPageInfo } from "@/lib/shopify";
import { Button } from "@/components/ui/button";

interface ProductsPaginationProps {
  pageInfo: ShopifyPageInfo;
  currentPage: number;
  currentCursor?: string;
}

export function ProductsPagination({
  pageInfo,
  currentPage,
  currentCursor,
}: ProductsPaginationProps) {
  const { hasNextPage, hasPreviousPage, endCursor } = pageInfo;

  // Construire les URLs de pagination avec le numéro de page et le curseur encodé
  // 'c' pour cursor (navigation suivante), 'p' pour prevCursor (navigation précédente)
  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;

  // URLs avec curseur encodé dans le paramètre 'c' pour la navigation suivante
  const nextUrl =
    hasNextPage && endCursor
      ? `/products?page=${nextPage}&c=${encodeURIComponent(endCursor)}`
      : null;
  
  // URLs avec prevCursor encodé dans le paramètre 'p' pour la navigation précédente
  const prevUrl =
    hasPreviousPage && prevPage > 0 && currentCursor
      ? prevPage === 1
        ? `/products`
        : `/products?page=${prevPage}&p=${encodeURIComponent(currentCursor)}`
      : null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      {/* Boutons Précédent/Suivant */}
      <div className="flex items-center justify-center gap-4">
        {prevUrl ? (
          <Button asChild variant="outline">
            <Link href={prevUrl}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
        )}

        {/* Numéro de page actuel */}
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Page
          </span>
          <span className="font-semibold text-black dark:text-zinc-50">
            {currentPage}
          </span>
        </div>

        {nextUrl ? (
          <Button asChild variant="outline">
            <Link href={nextUrl}>
              Suivant
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

