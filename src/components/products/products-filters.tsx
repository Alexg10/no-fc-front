"use client";

import {
  FilterPanel,
  PRICE_RANGES,
} from "@/components/products/_components/filter-panel";
import { SortControl } from "@/components/products/_components/sort-control";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { ShopifyCollection, VariantOption } from "@/lib/shopify";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductsFiltersProps {
  defaultCollection?: string;
  variantOptions?: VariantOption[];
  collections?: ShopifyCollection[];
}

function parsePriceRangesFromURL(searchParams: URLSearchParams): string[] {
  const param = searchParams.get("priceRanges");
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

function parseVariantsFromURL(
  searchParams: URLSearchParams,
  variantOptions: VariantOption[],
): Record<string, string[]> {
  const selections: Record<string, string[]> = {};
  for (const option of variantOptions) {
    const value = searchParams.get(`variant_${option.name}`);
    if (value) {
      selections[option.name] = value.split(",").filter(Boolean);
    }
  }
  return selections;
}

function parseCollectionsFromURL(searchParams: URLSearchParams): string[] {
  const param = searchParams.get("collections");
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

export function ProductsFilters({
  defaultCollection,
  variantOptions = [],
  collections = [],
}: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  const initialSortKey = searchParams.get("sort") || "RELEVANCE";

  const [sortKey, setSortKey] = useState<string>(initialSortKey);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(
    parsePriceRangesFromURL(searchParams),
  );
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string[]>
  >(parseVariantsFromURL(searchParams, variantOptions));
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    parseCollectionsFromURL(searchParams),
  );

  // Sync state from URL when searchParams change
  useEffect(() => {
    setSortKey(searchParams.get("sort") || "RELEVANCE");
    setSelectedPriceRanges(parsePriceRangesFromURL(searchParams));
    setSelectedVariants(parseVariantsFromURL(searchParams, variantOptions));
    setSelectedCollections(parseCollectionsFromURL(searchParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const buildURL = (overrides?: {
    sortKey?: string;
    priceRanges?: string[];
    variants?: Record<string, string[]>;
    collections?: string[];
  }) => {
    const params = new URLSearchParams();

    const currentSort = overrides?.sortKey ?? sortKey;
    const currentPriceRanges = overrides?.priceRanges ?? selectedPriceRanges;
    const currentVariants = overrides?.variants ?? selectedVariants;
    const currentCollections = overrides?.collections ?? selectedCollections;

    if (currentSort && currentSort !== "RELEVANCE")
      params.set("sort", currentSort);

    // Price ranges as comma-separated keys
    if (currentPriceRanges.length > 0) {
      params.set("priceRanges", currentPriceRanges.join(","));

      // Also compute minPrice/maxPrice for Shopify API
      const ranges = PRICE_RANGES.filter((r) =>
        currentPriceRanges.includes(r.key),
      );
      const mins = ranges.map((r) => r.min ?? 0);
      const maxes = ranges
        .map((r) => r.max)
        .filter((m): m is number => m !== undefined);

      const overallMin = Math.min(...mins);
      const overallMax = maxes.length > 0 ? Math.max(...maxes) : undefined;

      // If "over100" is selected, don't set maxPrice
      const hasOpenEnded = currentPriceRanges.includes("over100");

      if (overallMin > 0) params.set("minPrice", overallMin.toString());
      if (overallMax !== undefined && !hasOpenEnded)
        params.set("maxPrice", overallMax.toString());
    }

    // Variant filters (comma-separated values per option)
    for (const [optionName, values] of Object.entries(currentVariants)) {
      if (values.length > 0) {
        params.set(`variant_${optionName}`, values.join(","));
      }
    }

    // Collections
    if (currentCollections.length > 0) {
      params.set("collections", currentCollections.join(","));
    }

    return params;
  };

  const navigate = (params: URLSearchParams) => {
    const queryString = params.toString();
    const pathWithQuery = queryString ? `?${queryString}` : "";

    if (defaultCollection) {
      router.push(`/collections/${defaultCollection}${pathWithQuery}`);
    } else {
      router.push(`/products${pathWithQuery}`);
    }
  };

  const handleSortChange = (value: string) => {
    setSortKey(value);
    const params = buildURL({ sortKey: value });
    navigate(params);
  };

  const handlePriceRangeChange = (ranges: string[]) => {
    setSelectedPriceRanges(ranges);
    const params = buildURL({ priceRanges: ranges });
    navigate(params);
  };

  const handleVariantChange = (optionName: string, values: string[]) => {
    const newVariants = { ...selectedVariants, [optionName]: values };
    setSelectedVariants(newVariants);
    const params = buildURL({ variants: newVariants });
    navigate(params);
  };

  const handleCollectionChange = (cols: string[]) => {
    setSelectedCollections(cols);
    const params = buildURL({ collections: cols });
    navigate(params);
  };

  const clearFilters = () => {
    setSortKey("RELEVANCE");
    setSelectedPriceRanges([]);
    setSelectedVariants({});
    setSelectedCollections([]);

    if (defaultCollection) {
      router.push(`/collections/${defaultCollection}`);
    } else {
      router.push("/products");
    }
  };

  const hasActiveFilters =
    (sortKey && sortKey !== "RELEVANCE") ||
    selectedPriceRanges.length > 0 ||
    selectedCollections.length > 0 ||
    Object.values(selectedVariants).some((v) => v.length > 0);

  return (
    <div className="mb-10">
      <div className="flex gap-2 justify-center items-center">
        <FilterPanel
          collections={collections}
          variantOptions={variantOptions}
          selectedPriceRanges={selectedPriceRanges}
          selectedVariants={selectedVariants}
          selectedCollections={selectedCollections}
          onPriceRangeChange={handlePriceRangeChange}
          onVariantChange={handleVariantChange}
          onCollectionChange={handleCollectionChange}
          defaultCollection={defaultCollection}
        />
        <SortControl value={sortKey} onChange={handleSortChange} />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-dark cursor-pointer dark:text-zinc-400 bg-transparent border-none p-0 hover:text-black dark:hover:text-zinc-50 gap-0 text-[16px] normal-case"
          >
            <X className="h-4 w-4 mr-2" />
            {t("resetFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
