import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { getProductImages } from "@/lib/shopify";
import type { StrapiArticlesProduct } from "@/types/strapi";
import Image from "next/image";

interface ProductBlockProps {
  block: StrapiArticlesProduct;
  locale?: string;
}

export async function ProductBlock({ block, locale = "" }: ProductBlockProps) {
  if (!block.product) return null;

  const { product } = block;
  const productLink = `${locale ? `/${locale}` : ""}/products/${
    product.handle
  }`;

  const shopifyImages = await getProductImages(product.handle);
  const firstImage = shopifyImages?.images.edges[0]?.node;
  const imageUrl =
    firstImage?.url || (product.image?.url ? product.image.url : null);
  const imageAlt =
    firstImage?.altText || product.image?.alternativeText || product.title;

  return (
    <section className="py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {imageUrl && (
            <Link
              href={productLink}
              className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
              />
            </Link>
          )}

          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                {product.title}
              </h2>
              <div className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
                {product.price.toFixed(2)} €
              </div>
              {product.available !== undefined && (
                <div className="mt-2">
                  {product.available ? (
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      ✓ En stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      ✗ Rupture de stock
                    </span>
                  )}
                </div>
              )}
            </div>

            {product.description && (
              <div
                className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
                dangerouslySetInnerHTML={{
                  __html: block.product.description as unknown as string,
                }}
              />
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Link href={productLink} className="w-full">
                <Button className="w-full" size="lg">
                  Voir la fiche produit
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full">
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
