"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/lib/navigation";
import { ShopifyPageInfo } from "@/lib/shopify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const pathname = usePathname();
  const t = useTranslations("common");
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = pageInfo;

  // Préserver les filtres dans l'URL
  const buildUrl = (
    page: number,
    cursor?: string,
    cursorType?: "after" | "before",
  ) => {
    const params = new URLSearchParams();

    // Ajouter les filtres existants
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const available = searchParams.get("available");
    const collection = searchParams.get("collection");

    if (sort) params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (available) params.set("available", available);
    if (collection) params.set("collection", collection);

    // Ajouter la pagination
    if (page > 1) {
      params.set("page", page.toString());
    }

    if (cursor && cursorType) {
      params.set(cursorType, cursor);
    }

    const queryString = params.toString();

    // usePathname() de next-intl retourne déjà le pathname sans la locale
    // Détecter si on est sur une page de collection
    const isCollectionPage = pathname.startsWith("/collections/");
    const collectionHandle = isCollectionPage
      ? pathname.split("/collections/")[1]?.split("?")[0]
      : null;

    // Si on est sur une page de collection, garder l'URL de collection
    if (isCollectionPage && collectionHandle) {
      return queryString
        ? `/collections/${collectionHandle}?${queryString}`
        : `/collections/${collectionHandle}`;
    }

    // Sinon, utiliser /products
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
      <div className="flex items-center justify-center gap-6 text-black">
        {prevUrl ? (
          <Button asChild variant="outline" className="text-black size-14">
            <Link href={prevUrl}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="text-black size-14 border-none flex items-center justify-center"
          >
            <div className="border-1 border-black p-2">
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
        )}

        <div className="flex items-center gap-2 px-4 py-2">
          <span className="font-semibold text-black dark:text-zinc-50">
            {currentPage}
          </span>
        </div>

        {nextUrl ? (
          <Button asChild variant="outline" className="text-black">
            <Link href={nextUrl}>
              <ChevronRight className=" h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="text-black border-none flex items-center justify-center"
          >
            <div className="border-1 border-black p-2">
              <ChevronRight className=" h-4 w-4" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
