import { Link } from "@/lib/navigation";
import { getProductByHandle } from "@/lib/shopify";
import type { StrapiHomeProducts } from "@/types/strapi";
import Image from "next/image";

interface HomeProductsBlockProps {
  block: StrapiHomeProducts;
}

export async function HomeProductsBlock({ block }: HomeProductsBlockProps) {
  if (!block.products || block.products.length === 0) {
    return null;
  }

  const validProductHandles = block.products
    .map((p) => p.handle)
    .filter((handle): handle is string => Boolean(handle));

  if (validProductHandles.length === 0) {
    return null;
  }

  // Récupérer tous les produits en parallèle
  const productsPromises = validProductHandles.map((handle) =>
    getProductByHandle(handle).catch((error) => {
      console.error(
        `[HomeProductsBlock] Error fetching product ${handle}:`,
        error
      );
      return null;
    })
  );
  const products = await Promise.all(productsPromises);

  const validProducts = products.filter(
    (product): product is NonNullable<typeof product> => product !== null
  );

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {block.title && (
        <h2 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
          {block.title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validProducts.map((product, index) => {
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
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  {product.title}
                </h3>

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
    </section>
  );
}
