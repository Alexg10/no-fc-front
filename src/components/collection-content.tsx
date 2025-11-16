import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsPagination } from "@/components/products/products-pagination";
import {
  getCollectionProducts,
  getCollections,
  ProductSortKey,
} from "@/lib/shopify";
import { Link } from "@/lib/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
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

  // Récupérer les collections pour les filtres
  const collectionsData = await getCollections();
  const collections = collectionsData.edges.map((edge) => edge.node);

  // Vérifier que la collection existe
  const currentCollection = collections.find((c) => c.handle === handle);
  if (!currentCollection) {
    notFound();
  }

  // Récupérer les produits de la collection
  const productsData = await getCollectionProducts(handle, {
    first: 12,
    after: page === 1 ? undefined : after,
    before: before,
    last: before ? 12 : undefined,
    sortKey,
    reverse,
  });

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
          {products.map(({ node: product }, index) => {
            const firstImage = product.images.edges[0]?.node;
            const price = product.priceRange.minVariantPrice;
            const isAboveFold = index < 8;

            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  {firstImage ? (
                    <Image
                      src={firstImage.url}
                      alt={firstImage.altText || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      loading={isAboveFold ? "eager" : "lazy"}
                      priority={isAboveFold}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
                      <svg
                        className="w-16 h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col grow">
                  <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {product.title}
                  </h2>

                  {product.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2 grow">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="text-xl font-bold text-black dark:text-zinc-50">
                      {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {products.length > 0 && (
        <ProductsPagination pageInfo={pageInfo} currentPage={page} />
      )}
    </>
  );
}

