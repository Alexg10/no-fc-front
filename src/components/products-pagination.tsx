"use client";

import { Button } from "@/components/ui/button";
import { ShopifyPageInfo } from "@/lib/shopify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductsPaginationProps {
  pageInfo: ShopifyPageInfo;
  currentPage: number;
}

export function ProductsPagination({
  pageInfo,
  currentPage,
}: ProductsPaginationProps) {
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = pageInfo;

  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;

  const nextUrl =
    hasNextPage && endCursor
      ? `/products?page=${nextPage}&after=${encodeURIComponent(endCursor)}`
      : null;

  const prevUrl =
    hasPreviousPage && startCursor && prevPage > 0
      ? prevPage === 1
        ? `/products`
        : `/products?page=${prevPage}&before=${encodeURIComponent(startCursor)}`
      : null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
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

        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Page</span>
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
