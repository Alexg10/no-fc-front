import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCollectionProducts,
  getCollections,
  getProductOptions,
  getProducts,
  ProductSortKey,
} from "@/lib/shopify";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface CollectionContentProps {
  locale: string;
  handle: string;
  searchParams: {
    page?: string;
    after?: string;
    before?: string;
    sort?: string;
    [key: string]: string | undefined;
  };
}

export async function CollectionContent({
  locale,
  handle,
  searchParams,
}: CollectionContentProps) {
  const t = await getTranslations({ locale, namespace: "products" });
  const page = parseInt(searchParams.page || "1", 10);
  const after = searchParams.after;
  const before = searchParams.before;
  const sortParam = searchParams.sort || "RELEVANCE";
  const minPrice = searchParams.minPrice
    ? parseFloat(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? parseFloat(searchParams.maxPrice)
    : undefined;

  // Extraire les filtres de variants depuis les paramètres URL
  const variantFilters: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith("variant_") && value) {
      const optionName = key.replace("variant_", "");
      variantFilters[optionName] = value.split(",").filter(Boolean);
    }
  }

  const hasVariantFilters = Object.values(variantFilters).some(
    (v) => v.length > 0,
  );
  const hasPriceFilters = minPrice !== undefined || maxPrice !== undefined;

  // Gérer le tri avec reverse
  let sortKey: ProductSortKey | undefined;
  let reverse = false;

  if (sortParam === "PRICE_REVERSE") {
    sortKey = "PRICE";
    reverse = true;
  } else if (sortParam === "TITLE_REVERSE") {
    sortKey = "TITLE";
    reverse = true;
  } else if (sortParam && sortParam !== "RELEVANCE") {
    sortKey = sortParam as ProductSortKey;
  }

  // Si des filtres de prix sont actifs, utiliser getProducts avec collection:handle
  // car getCollectionProducts ne supporte pas les filtres de prix
  // Les filtres de variants sont appliqués côté serveur après le fetch
  const productsDataPromise = hasPriceFilters
    ? getProducts({
        first: hasVariantFilters ? 50 : 12,
        after: hasVariantFilters ? undefined : (page === 1 ? undefined : after),
        before: hasVariantFilters ? undefined : before,
        last: hasVariantFilters ? undefined : (before ? 12 : undefined),
        sortKey,
        reverse,
        collection: handle,
        minPrice,
        maxPrice,
      })
    : hasVariantFilters
      ? getCollectionProducts(handle, {
          first: 50,
          sortKey,
          reverse,
        })
      : getCollectionProducts(handle, {
          first: 12,
          after: page === 1 ? undefined : after,
          before: before,
          last: before ? 12 : undefined,
          sortKey,
          reverse,
        });

  const [collectionsData, productsData, variantOptions] = await Promise.all([
    getCollections(),
    productsDataPromise,
    getProductOptions(handle),
  ]);

  const collections = collectionsData.edges.map((edge) => edge.node);

  // Vérifier que la collection existe
  const currentCollection = collections.find((c) => c.handle === handle);
  if (!currentCollection) {
    notFound();
  }

  const { edges: allProducts, pageInfo } = productsData;

  // Filtrer les produits par variant options côté serveur
  const products = hasVariantFilters
    ? allProducts.filter(({ node: product }) => {
        const productOptions = (
          product as typeof product & {
            options?: { name: string; values: string[] }[];
          }
        ).options;
        if (!productOptions) return true;

        return Object.entries(variantFilters).every(
          ([optionName, selectedValues]) => {
            if (selectedValues.length === 0) return true;
            const productOption = productOptions.find(
              (o) => o.name === optionName,
            );
            if (!productOption) return false;
            return selectedValues.some((v) => productOption.values.includes(v));
          },
        );
      })
    : allProducts;

  return (
    <>
      <ProductsFilters
        defaultCollection={handle}
        variantOptions={variantOptions}
        collections={collections}
      />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            {t("noProductsInCollection")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {products.map(({ node: product }, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isAboveFold={index < 8}
            />
          ))}
        </div>
      )}

      {products.length > 0 && (
        <ProductsPagination pageInfo={pageInfo} currentPage={page} />
      )}
    </>
  );
}
