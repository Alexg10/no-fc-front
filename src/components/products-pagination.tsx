"use client";

import { Button } from "@/components/ui/button";
import { ShopifyPageInfo } from "@/lib/shopify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface ProductsPaginationProps {
  pageInfo: ShopifyPageInfo;
  currentPage: number;
}

export function ProductsPagination({
  pageInfo,
  currentPage,
}: ProductsPaginationProps) {
  const searchParams = useSearchParams();
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = pageInfo;

  // Préserver les filtres dans l'URL
  const buildUrl = (
    page: number,
    cursor?: string,
    cursorType?: "after" | "before"
  ) => {
    const params = new URLSearchParams();

    // Ajouter les filtres existants
    const collection = searchParams.get("collection");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const available = searchParams.get("available");

    if (collection) params.set("collection", collection);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (available) params.set("available", available);

    // Ajouter la pagination
    if (page > 1) {
      params.set("page", page.toString());
    }

    if (cursor && cursorType) {
      params.set(cursorType, cursor);
    }

    const queryString = params.toString();
    return queryString ? `/products?${queryString}` : "/products";
  };

  const nextPage = currentPage + 1;
  const prevPage = currentPage - 1;

  const nextUrl =
    hasNextPage && endCursor ? buildUrl(nextPage, endCursor, "after") : null;

  const prevUrl =
    hasPreviousPage && startCursor && prevPage > 0
      ? buildUrl(prevPage === 1 ? 1 : prevPage, startCursor, "before")
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
