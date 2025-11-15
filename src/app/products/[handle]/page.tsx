import { getProductByHandle } from "@/lib/shopify";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  try {
    const product = await getProductByHandle(handle);

    if (!product) {
      notFound();
    }

    const firstImage = product.images.edges[0]?.node;
    const price = product.priceRange.minVariantPrice;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images du produit */}
          <div className="space-y-4">
            {firstImage && (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={firstImage.url}
                  alt={firstImage.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.edges.slice(1, 5).map(({ node: image }) => (
                  <div
                    key={image.id}
                    className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
                {product.title}
              </h1>
              <div className="text-3xl font-semibold text-black dark:text-zinc-50">
                {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants.edges.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Variantes disponibles
                </h2>
                <div className="space-y-2">
                  {product.variants.edges.map(({ node: variant }) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-black dark:text-zinc-50">
                          {variant.title}
                        </div>
                        {variant.selectedOptions.length > 0 && (
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {variant.selectedOptions
                              .map((opt) => `${opt.name}: ${opt.value}`)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black dark:text-zinc-50">
                          {parseFloat(variant.price.amount).toFixed(2)}{" "}
                          {variant.price.currencyCode}
                        </div>
                        <div
                          className={`text-sm ${
                            variant.availableForSale
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {variant.availableForSale
                            ? "En stock"
                            : "Rupture de stock"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton d'ajout au panier (à implémenter plus tard) */}
            <button
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              disabled
            >
              Ajouter au panier (à venir)
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    throw error;
  }
}
