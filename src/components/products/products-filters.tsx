"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShopifyCollection } from "@/lib/shopify";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductsFiltersProps {
  collections: ShopifyCollection[];
  defaultCollection?: string;
}

export function ProductsFilters({
  collections,
  defaultCollection,
}: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  const tProducts = useTranslations("products");

  // Initialiser les valeurs depuis les paramètres d'URL ou les props
  const initialCollection =
    defaultCollection || searchParams.get("collection") || "";
  const initialSortKey = searchParams.get("sort") || "RELEVANCE";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialAvailableOnly = searchParams.get("available") === "true";

  const [collection, setCollection] = useState<string>(initialCollection);
  const [sortKey, setSortKey] = useState<string>(initialSortKey);
  const [minPrice, setMinPrice] = useState<string>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialMaxPrice);
  const [availableOnly, setAvailableOnly] =
    useState<boolean>(initialAvailableOnly);

  // Synchroniser avec les paramètres d'URL quand ils changent
  // Utiliser un callback pour éviter l'avertissement du linter
  useEffect(() => {
    const updateFromURL = () => {
      const collectionParam =
        defaultCollection || searchParams.get("collection") || "";
      const sortParam = searchParams.get("sort") || "RELEVANCE";
      const minPriceParam = searchParams.get("minPrice") || "";
      const maxPriceParam = searchParams.get("maxPrice") || "";
      const availableParam = searchParams.get("available") === "true";

      setCollection(collectionParam);
      setSortKey(sortParam);
      setMinPrice(minPriceParam);
      setMaxPrice(maxPriceParam);
      setAvailableOnly(availableParam);
    };

    updateFromURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), defaultCollection]);

  const updateURL = () => {
    const params = new URLSearchParams();

    // Garder la pagination
    const page = searchParams.get("page");
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    if (page) params.set("page", page);
    if (after) params.set("after", after);
    if (before) params.set("before", before);

    // Ajouter les filtres
    if (sortKey && sortKey !== "RELEVANCE") params.set("sort", sortKey);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (availableOnly) params.set("available", "true");

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

    const params = new URLSearchParams();
    const page = searchParams.get("page");
    if (page) params.set("page", page);

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  // Convertir la valeur de collection pour le Select ("" devient "all")
  const collectionSelectValue = collection || "all";

  const hasActiveFilters =
    collection ||
    (sortKey && sortKey !== "RELEVANCE") ||
    minPrice ||
    maxPrice ||
    availableOnly;

  return (
    <div className="space-y-4 mb-8 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {t("filtersAndSort")}
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
          >
            <X className="h-4 w-4 mr-2" />
            {t("resetFilters")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Collection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-50">
            Collection
          </label>
          <Select
            value={collectionSelectValue}
            onValueChange={(value) =>
              setCollection(value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("allCollections")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCollections")}</SelectItem>
              {collections.map((col) => (
                <SelectItem key={col.id} value={col.handle}>
                  {col.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-50">
            {t("sortBy")}
          </label>
          <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RELEVANCE">{tProducts("sort.relevance")}</SelectItem>
              <SelectItem value="CREATED_AT">{tProducts("sort.newest")}</SelectItem>
              <SelectItem value="PRICE">{tProducts("sort.priceAsc")}</SelectItem>
              <SelectItem value="PRICE_REVERSE">{tProducts("sort.priceDesc")}</SelectItem>
              <SelectItem value="TITLE">{tProducts("sort.nameAsc")}</SelectItem>
              <SelectItem value="TITLE_REVERSE">{tProducts("sort.nameDesc")}</SelectItem>
              <SelectItem value="BEST_SELLING">{tProducts("sort.bestSelling")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prix minimum */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-50">
            {t("minPrice")}
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Prix maximum */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-50">
            {t("maxPrice")}
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="∞"
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Disponibilité */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="available"
          checked={availableOnly}
          onCheckedChange={(checked) => setAvailableOnly(checked === true)}
        />
        <label
          htmlFor="available"
          className="text-sm font-medium text-black dark:text-zinc-50 cursor-pointer"
        >
          {t("availableOnly")}
        </label>
      </div>

      {/* Bouton Appliquer */}
      <div className="pt-2">
        <Button onClick={updateURL} className="w-full md:w-auto">
          {t("applyFilters")}
        </Button>
      </div>
    </div>
  );
}
