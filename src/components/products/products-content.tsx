import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCollectionProducts,
  getCollections,
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

  // Récupérer les produits avec filtres
  // Si une collection est sélectionnée, utiliser getCollectionProducts
  // Sinon, utiliser getProducts avec les autres filtres
  let productsDataPromise;

  if (collection) {
    // Utiliser getCollectionProducts pour une collection spécifique
    productsDataPromise = getCollectionProducts(collection, {
      first: 12,
      after: page === 1 ? undefined : after,
      before: before,
      last: before ? 12 : undefined,
      sortKey,
      reverse,
    });
  } else {
    // Utiliser getProducts pour tous les produits avec filtres
    productsDataPromise = getProducts({
      first: 12,
      after: page === 1 ? undefined : after,
      before: before,
      last: before ? 12 : undefined,
      sortKey,
      reverse,
      minPrice,
      maxPrice,
      availableOnly,
    });
  }

  // Paralléliser: récupérer collections et produits en même temps
  const [collectionsData, productsData] = await Promise.all([
    getCollections(),
    productsDataPromise,
  ]);

  const collections = collectionsData.edges.map((edge) => edge.node);

  const { edges: products, pageInfo } = productsData;

  // Récupérer le titre de la collection si disponible
  let collectionTitle: string | null = null;
  if (collection) {
    const collectionData = productsData as typeof productsData & {
      collection?: ShopifyCollection;
    };
    if (collectionData.collection) {
      collectionTitle = collectionData.collection.title;
    } else {
      collectionTitle =
        collections.find((c) => c.handle === collection)?.title || null;
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

      <ProductsFilters collections={collections} />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            {collection ? t("noProductsInCollection") : t("noProducts")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
