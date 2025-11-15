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
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface ProductsFiltersProps {
  collections: ShopifyCollection[];
}

export function ProductsFilters({ collections }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [collection, setCollection] = useState<string>(
    searchParams.get("collection") || ""
  );
  const [sortKey, setSortKey] = useState<string>(
    searchParams.get("sort") || "RELEVANCE"
  );
  const [minPrice, setMinPrice] = useState<string>(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    searchParams.get("maxPrice") || ""
  );
  const [availableOnly, setAvailableOnly] = useState<boolean>(
    searchParams.get("available") === "true"
  );

  // Synchroniser avec les paramètres d'URL au montage
  useEffect(() => {
    const collectionParam = searchParams.get("collection");
    setCollection(collectionParam || "");
    setSortKey(searchParams.get("sort") || "RELEVANCE");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setAvailableOnly(searchParams.get("available") === "true");
  }, [searchParams]);

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
    if (collection) params.set("collection", collection);
    if (sortKey && sortKey !== "RELEVANCE") params.set("sort", sortKey);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (availableOnly) params.set("available", "true");
    
    router.push(`/products?${params.toString()}`);
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
    
    router.push(`/products?${params.toString()}`);
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
          Filtres et tri
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
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
            onValueChange={(value) => setCollection(value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les collections</SelectItem>
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
            Trier par
          </label>
          <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RELEVANCE">Pertinence</SelectItem>
              <SelectItem value="CREATED_AT">Plus récent</SelectItem>
              <SelectItem value="PRICE">Prix croissant</SelectItem>
              <SelectItem value="PRICE_REVERSE">Prix décroissant</SelectItem>
              <SelectItem value="TITLE">Nom (A-Z)</SelectItem>
              <SelectItem value="TITLE_REVERSE">Nom (Z-A)</SelectItem>
              <SelectItem value="BEST_SELLING">Meilleures ventes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prix minimum */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black dark:text-zinc-50">
            Prix minimum
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
            Prix maximum
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
          Afficher uniquement les produits en stock
        </label>
      </div>

      {/* Bouton Appliquer */}
      <div className="pt-2">
        <Button onClick={updateURL} className="w-full md:w-auto">
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}

