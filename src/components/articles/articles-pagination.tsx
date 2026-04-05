"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/lib/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ArticlesPaginationProps {
  currentPage: number;
  pageCount: number;
}

/** Fenêtre de 3 pages autour de la courante + 1 et dernière ; ellipses si trous. Moins de 4 pages au total : tout afficher sans ellipsis. */
export function buildPaginationItems(
  currentPage: number,
  pageCount: number,
): Array<number | "ellipsis"> {
  if (pageCount < 4) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 1, pageCount - 2));
  const windowPages = [start, start + 1, start + 2] as const;

  const pages = new Set<number>([1, pageCount, ...windowPages]);
  const sorted = [...pages].sort((a, b) => a - b);

  const out: Array<number | "ellipsis"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) {
      out.push("ellipsis");
    }
    out.push(p);
  });
  return out;
}

export function ArticlesPagination({
  currentPage,
  pageCount,
}: ArticlesPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (key !== "page") {
        params.set(key, value);
      }
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const prevUrl = currentPage > 1 ? buildUrl(currentPage - 1) : null;
  const nextUrl = currentPage < pageCount ? buildUrl(currentPage + 1) : null;

  const items = buildPaginationItems(currentPage, pageCount);

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-28">
      <div className="flex items-center justify-center gap-4 md:gap-8 text-black">
        {prevUrl ? (
          <Button
            asChild
            variant="outline"
            className="text-black shadow-none flex items-center justify-center size-14 shrink-0 border-white"
          >
            <Link href={prevUrl}>
              <div className="border-1 border-black p-2">
                <ChevronLeft className="h-4 w-4" />
              </div>
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="size-14 shadow-none shrink-0 flex items-center justify-center border-white text-zinc-400 cursor-not-allowed bg-white"
            aria-disabled
          >
            <div className="border-1 border-black p-2">
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
        )}

        <div className="flex items-center justify-center gap-4 md:gap-6 px-2 min-h-14 flex-wrap">
          {items.map((item, idx) =>
            item === "ellipsis" ? (
              <span
                key={`e-${idx}`}
                className="text-black select-none px-1"
                aria-hidden
              >
                …
              </span>
            ) : (
              <span key={item}>
                {item === currentPage ? (
                  <span className="font-bold text-lg tabular-nums">{item}</span>
                ) : (
                  <Link
                    href={buildUrl(item)}
                    className="text-lg tabular-nums text-black hover:underline underline-offset-4"
                  >
                    {item}
                  </Link>
                )}
              </span>
            ),
          )}
        </div>

        {nextUrl ? (
          <Button
            asChild
            variant="outline"
            className="text-black shadow-none border-none flex items-center justify-center"
          >
            <Link href={nextUrl}>
              <div className="border-1 border-black p-2">
                <ChevronRight className=" h-4 w-4" />
              </div>
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="size-14 shadow-none shrink-0 flex items-center justify-center border-white text-zinc-400 cursor-not-allowed bg-white"
            aria-disabled
          >
            <div className="border-1 border-black/50 p-2">
              <ChevronRight className=" h-4 w-4" />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}
