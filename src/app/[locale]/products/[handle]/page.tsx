import { AddToCartButton } from "@/components/add-to-cart-button";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { ProductSchema } from "@/components/products/product-schema";
import { generateProductMetadata } from "@/lib/metadata";
import { getProductWithCustomizations } from "@/lib/products";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const { shopify: product } = await getProductWithCustomizations(
    handle,
    locale
  );

  if (!product) {
    return {
      title: t("productNotFound.title"),
      description: t("productNotFound.description"),
    };
  }

  return generateProductMetadata(product, handle);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle, locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  try {
    const { shopify: product, strapi: strapiProduct } =
      await getProductWithCustomizations(handle, locale);

    if (!product) {
      notFound();
    }

    const firstImage = product.images.edges[0]?.node;
    const price = product.priceRange.minVariantPrice;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Breadcrumbs pour Schema.org
    const breadcrumbItems = [
      { name: tCommon("home"), url: siteUrl },
      { name: tCommon("products"), url: `${siteUrl}/${locale}/products` },
      { name: product.title, url: `${siteUrl}/${locale}/products/${handle}` },
    ];

    return (
      <>
        <ProductSchema product={product} />
        <BreadcrumbSchema items={breadcrumbItems} />
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
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                        sizes="(max-width: 768px) 25vw, 20vw"
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
                    {t("variants")}
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
                              ? t("inStock")
                              : t("outOfStock")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton d'ajout au panier */}
              {product.variants.edges.length === 1 ? (
                <AddToCartButton
                  variantId={product.variants.edges[0].node.id}
                  availableForSale={
                    product.variants.edges[0].node.availableForSale
                  }
                  variantTitle={product.variants.edges[0].node.title}
                  fullWidth={true}
                />
              ) : product.variants.edges.length > 1 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                    {t("selectVariant")}
                  </h3>
                  <div className="space-y-2">
                    {product.variants.edges.map(({ node: variant }) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                      >
                        <div className="flex-1">
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
                        <div className="flex items-center gap-4">
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
                                ? t("inStock")
                                : t("outOfStock")}
                            </div>
                          </div>
                          <AddToCartButton
                            variantId={variant.id}
                            availableForSale={variant.availableForSale}
                            variantTitle={variant.title}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-zinc-600 dark:text-zinc-400">
                  {t("noVariants")}
                </div>
              )}
            </div>
          </div>

          {strapiProduct?.blocks && strapiProduct.blocks.length > 0 && (
            <div className="col-span-full mt-12 space-y-8">
              {strapiProduct.blocks.map((block, index) => (
                <Suspense
                  key={block.id || index}
                  fallback={<BlockSkeleton />}
                >
                  <BlockRenderer
                    block={block}
                    locale={locale}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    throw error;
  }
}
