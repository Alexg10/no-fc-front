import { AddToCartButton } from "@/components/add-to-cart-button";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { BlockRenderer } from "@/components/common/block-renderer";
import { ProductDescription } from "@/components/products/product-description";
import { ProductSchema } from "@/components/products/product-schema";
import { VariantSelector } from "@/components/products/variant-selector";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { Title } from "@/components/ui/title";
import { generateProductMetadata } from "@/lib/metadata";
import { getProductWithCustomizations } from "@/lib/products";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
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
    locale,
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
      <div className="bg-off-white md:pt-4 lg:pt-6">
        <ProductSchema product={product} />
        <BreadcrumbSchema items={breadcrumbItems} />
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:px-4 lg:grid-cols-12 lg:gap-4 lg:px-4 lg:max-w-[1464px] lg:mx-auto">
            <div className="space-y-4 md:space-y-6 md:col-span-3 md:order-2 lg:col-span-6 lg:col-start-7">
              {firstImage && (
                <div className="relative aspect-4/5 w-full overflow-hidden  ">
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
                <div className="flex flex-col gap-6">
                  {product.images.edges.slice(1, 5).map(({ node: image }) => (
                    <div
                      key={image.id}
                      className="relative aspect-4/5 w-full overflow-hidden"
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

            <div className="px-4 md:col-span-3 md:px-0 lg:col-span-3 lg:col-start-2">
              {product.variants.edges.length > 1 ? (
                <VariantSelector
                  variants={product.variants.edges.map((edge) => edge.node)}
                  productTitle={product.title}
                />
              ) : (
                <>
                  <div>
                    <Title level={1} className="lg:text-[64px]">
                      {product.title}
                    </Title>
                    <div className="text-3xl font-semibold text-black dark:text-zinc-50">
                      {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                    </div>
                  </div>

                  {/* Bouton d'ajout au panier pour un seul variant */}
                  <AddToCartButton
                    variantId={product.variants.edges[0].node.id}
                    availableForSale={
                      product.variants.edges[0].node.availableForSale
                    }
                    variantTitle={product.variants.edges[0].node.title}
                    fullWidth={true}
                  />
                </>
              )}

              {product.descriptionHtml && (
                <ProductDescription
                  html={product.descriptionHtml}
                  className="mt-6 list-disc lg:mt-15"
                />
              )}

              <div className="flex flex-col gap-1 lg:pt-2">
                <p className="text-polymath-display tracking-normal lg:text-[14px] lg:mb-1">
                  Livraison & retours
                </p>
                <p className="text-s-polymath text-[12px] leading-[120%]">
                  Nous livrons partout dans le monde ! Compter en moyenne 3/5
                  jours ouvrés pour recevoir votre colis en France
                  métropolitaine, et en moyenne 10 jours ouvrés pour recevoir
                  votre colis dans les autres pays.
                </p>
                <p className="text-s-polymath text-[12px]">
                  Nous acceptons les retours, échanges et remboursements.
                </p>
                <Link
                  href="/pages/livraison-et-retours"
                  className="text-s-polymath text-[12px] underline"
                >
                  Voir les conditions
                </Link>
              </div>
            </div>
          </div>

          {strapiProduct?.blocks && strapiProduct.blocks.length > 0 && (
            <div className="col-span-full mt-12">
              {strapiProduct.blocks.map((block, index) => (
                <Suspense key={block.id || index} fallback={<BlockSkeleton />}>
                  <BlockRenderer block={block} locale={locale} />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    throw error;
  }
}
