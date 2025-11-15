import { ShopifyProduct } from "@/lib/shopify";

interface ProductSchemaProps {
  product: ShopifyProduct;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${siteUrl}/products/${product.handle}`;

  const allImages = product.images.edges.map((edge) => edge.node.url);
  const isAvailable = product.variants.edges.some(
    (v) => v.node.availableForSale
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: allImages.length > 0 ? allImages : undefined,
    brand: {
      "@type": "Brand",
      name: "NOFC",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: price.currencyCode,
      price: price.amount,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      itemCondition: "https://schema.org/NewCondition",
    },
    sku: product.id,
    mpn: product.id,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
