import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCollectionProducts,
  getCollections,
  getProductOptions,
  getProducts,
  ProductSortKey,
  ShopifyCollection,
} from "@/lib/shopify";
import { getTranslations } from "next-intl/server";

interface ProductsContentProps {
  locale: string;
  searchParams: {
    page?: string;
    after?: string;
    before?: string;
    collection?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    available?: string;
    collections?: string;
    priceRanges?: string;
    [key: string]: string | undefined;
  };
}

export async function ProductsContent({
  locale,
  searchParams,
}: ProductsContentProps) {
  const t = await getTranslations({ locale, namespace: "products" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const page = parseInt(searchParams.page || "1", 10);
  const after = searchParams.after;
  const before = searchParams.before;
  const collection = searchParams.collection;
  const sortParam = searchParams.sort || "RELEVANCE";
  const minPrice = searchParams.minPrice
    ? parseFloat(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? parseFloat(searchParams.maxPrice)
    : undefined;
  const availableOnly = searchParams.available === "true";

  // Extraire les filtres de variants depuis les paramètres URL (variant_Couleur=Vert, variant_Taille=M,L)
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

  // Extraire les collections sélectionnées
  const selectedCollections = searchParams.collections
    ? searchParams.collections.split(",").filter(Boolean)
    : [];

  // Gérer le tri avec reverse
  let sortKey: ProductSortKey | undefined;
  let reverse = false;

  if (sortParam === "PRICE_REVERSE") {
    sortKey = "PRICE";
    reverse = true;
  } else if (sortParam === "TITLE_REVERSE") {
    sortKey = "TITLE";
    reverse = true;
  } else if (sortParam === "CREATED_AT") {
    sortKey = "CREATED_AT" as ProductSortKey;
    reverse = true;
  } else if (sortParam && sortParam !== "RELEVANCE") {
    sortKey = sortParam as ProductSortKey;
  }

  // Déterminer la collection pour le fetch
  // Si une seule collection est sélectionnée dans les filtres, l'utiliser
  const effectiveCollection =
    collection || (selectedCollections.length === 1 ? selectedCollections[0] : undefined);

  // Récupérer les produits avec filtres
  // Les filtres de variants sont appliqués côté serveur après le fetch
  let productsDataPromise;

  if (effectiveCollection && selectedCollections.length <= 1) {
    productsDataPromise = getCollectionProducts(effectiveCollection, {
      first: hasVariantFilters ? 50 : 12,
      after: hasVariantFilters ? undefined : (page === 1 ? undefined : after),
      before: hasVariantFilters ? undefined : before,
      last: hasVariantFilters ? undefined : (before ? 12 : undefined),
      sortKey,
      reverse,
      locale,
    });
  } else {
    productsDataPromise = getProducts({
      first: hasVariantFilters ? 50 : 12,
      after: hasVariantFilters ? undefined : (page === 1 ? undefined : after),
      before: hasVariantFilters ? undefined : before,
      last: hasVariantFilters ? undefined : (before ? 12 : undefined),
      sortKey,
      reverse,
      minPrice,
      maxPrice,
      availableOnly,
      collection: selectedCollections.length > 0 ? selectedCollections[0] : undefined,
    });
  }

  // Paralléliser: récupérer collections, produits et options de variants en même temps
  const [collectionsData, productsData, variantOptions] = await Promise.all([
    getCollections(),
    productsDataPromise,
    getProductOptions(effectiveCollection),
  ]);

  const collections = collectionsData.edges.map((edge) => edge.node);

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

  // Récupérer le titre de la collection si disponible
  let collectionTitle: string | null = null;
  if (effectiveCollection) {
    const collectionData = productsData as typeof productsData & {
      collection?: ShopifyCollection;
    };
    if (collectionData.collection) {
      collectionTitle = collectionData.collection.title;
    } else {
      collectionTitle =
        collections.find((c) => c.handle === effectiveCollection)?.title || null;
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: tCommon("home"), url: siteUrl },
    {
      name: collectionTitle || t("title"),
      url: collection
        ? `${siteUrl}/collections/${collection}`
        : `${siteUrl}/products`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8">
        {collectionTitle || t("title")}
      </h1>

      <ProductsFilters
        variantOptions={variantOptions}
        collections={collections}
      />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            {collection ? t("noProductsInCollection") : t("noProducts")}
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
      {products.length > 0 && (pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <ProductsPagination pageInfo={pageInfo} currentPage={page} />
      )}
    </>
  );
}
