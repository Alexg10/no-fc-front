import type { StrapiProduct } from "@/types/strapi";
import type { ShopifyProduct } from "./shopify";
import { getProductByHandle as getShopifyProduct } from "./shopify";
import { getProductByHandle as getStrapiProduct } from "./strapi";

export interface ProductWithCustomizations {
  shopify: ShopifyProduct | null;
  strapi: StrapiProduct | null;
}

/**
 * Récupère un produit avec ses customisations depuis Shopify et Strapi en parallèle
 * @param handle - Le handle du produit (slug)
 * @returns Un objet contenant les données Shopify et Strapi
 */
export async function getProductWithCustomizations(
  handle: string
): Promise<ProductWithCustomizations> {
  try {
    const [shopifyProduct, strapiProduct] = await Promise.all([
      getShopifyProduct(handle),
      getStrapiProduct(handle),
    ]);

    return {
      shopify: shopifyProduct,
      strapi: strapiProduct,
    };
  } catch (error) {
    console.error("Error fetching product with customizations:", error);
    const shopifyProduct = await getShopifyProduct(handle).catch(() => null);
    return {
      shopify: shopifyProduct,
      strapi: null,
    };
  }
}
