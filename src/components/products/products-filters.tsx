"use client";

import { SortControl } from "@/components/products/_components/sort-control";
import { VariantFilter } from "@/components/products/_components/variant-filter";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { VariantOption } from "@/lib/shopify";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductsFiltersProps {
  defaultCollection?: string;
  variantOptions?: VariantOption[];
}

export function ProductsFilters({
  defaultCollection,
  variantOptions = [],
}: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  // Initialiser les valeurs depuis les paramètres d'URL ou les props
  const initialCollection =
    defaultCollection || searchParams.get("collection") || "";
  const initialSortKey = searchParams.get("sort") || "RELEVANCE";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialAvailableOnly = searchParams.get("available") === "true";

  // Initialiser les options de variants depuis l'URL
  const getInitialVariantSelections = (): Record<string, string> => {
    const selections: Record<string, string> = {};
    for (const option of variantOptions) {
      const value = searchParams.get(`variant_${option.name}`);
      if (value) {
        selections[option.name] = value;
      }
    }
    return selections;
  };

  const [collection, setCollection] = useState<string>(initialCollection);
  const [sortKey, setSortKey] = useState<string>(initialSortKey);
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
  const [availableOnly, setAvailableOnly] =
    useState<boolean>(initialAvailableOnly);
  const [variantSelections, setVariantSelections] = useState<
    Record<string, string>
  >(getInitialVariantSelections);

  // Synchroniser avec les paramètres d'URL quand ils changent
  useEffect(() => {
    const updateFromURL = () => {
      const collectionParam =
        defaultCollection || searchParams.get("collection") || "";
      const sortParam = searchParams.get("sort") || "RELEVANCE";
      const minPriceParam = searchParams.get("minPrice") || "";
      const maxPriceParam = searchParams.get("maxPrice") || "";
      const availableParam = searchParams.get("available") === "true";

      const variantParams: Record<string, string> = {};
      for (const option of variantOptions) {
        const value = searchParams.get(`variant_${option.name}`);
        if (value) {
          variantParams[option.name] = value;
        }
      }

      setCollection(collectionParam);
      setSortKey(sortParam);
      setMinPrice(minPriceParam);
      setMaxPrice(maxPriceParam);
      setAvailableOnly(availableParam);
      setVariantSelections(variantParams);
    };

    updateFromURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), defaultCollection]);

  const updateURL = (overrides?: {
    sortKey?: string;
    variantSelections?: Record<string, string>;
  }) => {
    const params = new URLSearchParams();

    const currentSort = overrides?.sortKey ?? sortKey;
    const currentVariants = overrides?.variantSelections ?? variantSelections;

    // Ajouter les filtres
    if (currentSort && currentSort !== "RELEVANCE")
      params.set("sort", currentSort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (availableOnly) params.set("available", "true");

    // Ajouter les filtres de variants
    for (const [optionName, value] of Object.entries(currentVariants)) {
      if (value && value !== "all") {
        params.set(`variant_${optionName}`, value);
      }
    }

    const queryString = params.toString();
    const pathWithQuery = queryString ? `?${queryString}` : "";

    // Si on est sur une page de collection, rediriger vers /collections/[handle]
    // Sinon, utiliser /products avec le paramètre collection
    if (defaultCollection) {
      // Sur une page de collection, changer de collection = aller vers /products
      if (collection && collection !== defaultCollection) {
        params.set("collection", collection);
        const newQueryString = params.toString();
        router.push(`/products${newQueryString ? `?${newQueryString}` : ""}`);
      } else {
        // Sinon, rester sur la même collection avec les nouveaux filtres
        router.push(`/collections/${defaultCollection}${pathWithQuery}`);
      }
    } else {
      // Sur /products, ajouter le paramètre collection si sélectionné
      if (collection) params.set("collection", collection);
      const newQueryString = params.toString();
      router.push(`/products${newQueryString ? `?${newQueryString}` : ""}`);
    }
  };

  const clearFilters = () => {
    setCollection("");
    setSortKey("RELEVANCE");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
    setVariantSelections({});

    // Rester sur la page actuelle sans filtres
    if (defaultCollection) {
      router.push(`/collections/${defaultCollection}`);
    } else {
      router.push("/products");
    }
  };

  const handleVariantChange = (optionName: string, value: string) => {
    const newValue = value === "all" ? "" : value;
    const newSelections = {
      ...variantSelections,
      [optionName]: newValue,
    };
    setVariantSelections(newSelections);
    updateURL({ variantSelections: newSelections });
  };

  const handleSortChange = (value: string) => {
    setSortKey(value);
    updateURL({ sortKey: value });
  };

  const hasActiveVariantFilters = Object.values(variantSelections).some(
    (v) => v && v !== "all",
  );

  const hasActiveFilters =
    (sortKey && sortKey !== "RELEVANCE") ||
    minPrice ||
    maxPrice ||
    availableOnly ||
    hasActiveVariantFilters;

  return (
    <div className="mb-10">
      <div className="flex gap-2 justify-center items-center">
        <VariantFilter
          options={variantOptions}
          selectedOptions={variantSelections}
          onChange={handleVariantChange}
        />
        <SortControl value={sortKey} onChange={handleSortChange} />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-dark cursor-pointer dark:text-zinc-400 bg-transparent border-none p-0 hover:text-black dark:hover:text-zinc-50 gap-0  text-[16px] normal-case"
          >
            <X className="h-4 w-4 mr-2" />
            {t("resetFilters")}
          </Button>
        )}
      </div>

      {/* <div className="flex items-center justify-between pt-2">
        <Button onClick={updateURL} className="w-auto">
          {t("applyFilters")}
        </Button>
      </div> */}
    </div>
  );
}
