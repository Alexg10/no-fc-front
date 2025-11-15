import type { Metadata } from "next";
import { ShopifyProduct } from "./shopify";

/**
 * Génère les métadonnées pour une page produit
 */
export function generateProductMetadata(
  product: ShopifyProduct,
  handle: string
): Metadata {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${siteUrl}/products/${handle}`;

  return {
    title: `${product.title} | NOFC`,
    description: product.description
      ? product.description.substring(0, 160)
      : `Découvrez ${product.title} sur NOFC. Prix: ${parseFloat(
          price.amount
        ).toFixed(2)} ${price.currencyCode}`,
    openGraph: {
      title: product.title,
      description: product.description
        ? product.description.substring(0, 200)
        : `Découvrez ${product.title} sur NOFC`,
      url: productUrl,
      siteName: "NOFC",
      images: firstImage
        ? [
            {
              url: firstImage.url,
              width: firstImage.width,
              height: firstImage.height,
              alt: firstImage.altText || product.title,
            },
          ]
        : [],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description
        ? product.description.substring(0, 200)
        : `Découvrez ${product.title} sur NOFC`,
      images: firstImage ? [firstImage.url] : [],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}
