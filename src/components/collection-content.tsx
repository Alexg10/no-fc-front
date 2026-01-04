import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCollectionProducts,
  getCollections,
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
  };
}

export async function CollectionContent({
  locale,
  handle,
  searchParams,
}: CollectionContentProps) {
  const t = await getTranslations({ locale, namespace: "products" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const page = parseInt(searchParams.page || "1", 10);
  const after = searchParams.after;
  const before = searchParams.before;
  const sortParam = searchParams.sort || "RELEVANCE";

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

  const [collectionsData, productsData] = await Promise.all([
    getCollections(),
    getCollectionProducts(handle, {
      first: 12,
      after: page === 1 ? undefined : after,
      before: before,
      last: before ? 12 : undefined,
      sortKey,
      reverse,
    }),
  ]);

  const collections = collectionsData.edges.map((edge) => edge.node);

  // Vérifier que la collection existe
  const currentCollection = collections.find((c) => c.handle === handle);
  if (!currentCollection) {
    notFound();
  }

  const { edges: products, pageInfo } = productsData;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: tCommon("home"), url: siteUrl },
    { name: t("title"), url: `${siteUrl}/products` },
    { name: currentCollection.title, url: `${siteUrl}/collections/${handle}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
        {currentCollection.title}
      </h1>

      {currentCollection.description && (
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          {currentCollection.description}
        </p>
      )}

      <ProductsFilters collections={collections} defaultCollection={handle} />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            {t("noProductsInCollection")}
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
