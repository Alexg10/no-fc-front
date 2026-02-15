import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { BlockRenderer } from "@/components/common/block-renderer";
import { ProductSchema } from "@/components/products/product-schema";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { generateProductMetadata } from "@/lib/metadata";
import { getProductWithCustomizations } from "@/lib/products";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductContent } from "@/components/products/product-content";

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
  const { shopify: product, strapi: strapiProduct } =
    await getProductWithCustomizations(handle, locale);

  if (!product) {
    notFound();
  }

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
        <ProductContent product={product} />
        {strapiProduct?.blocks && strapiProduct.blocks.length > 0 && (
          <div className="col-span-full">
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
}
