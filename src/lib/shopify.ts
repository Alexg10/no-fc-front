import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// Initialisation du client Shopify
const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2024-10",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// Types pour les produits Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyProductEdge {
  node: ShopifyProduct;
}

// Requête GraphQL pour récupérer un produit par handle
const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

// Requête GraphQL pour récupérer la liste des produits
const GET_PRODUCTS = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/**
 * Récupère un produit par son handle
 * @param handle - Le handle du produit (slug)
 * @returns Le produit ou null si non trouvé
 */
export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  try {
    const response = await client.request(GET_PRODUCT_BY_HANDLE, {
      variables: { handle },
    });

    if (response.data?.product) {
      return response.data.product as ShopifyProduct;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Récupère la liste des produits
 * @param first - Nombre de produits à récupérer (par défaut: 20)
 * @returns La liste des produits
 */
export async function getProducts(
  first: number = 20
): Promise<ShopifyProductEdge[]> {
  try {
    const response = await client.request(GET_PRODUCTS, {
      variables: { first },
    });

    if (response.data?.products?.edges) {
      return response.data.products.edges as ShopifyProductEdge[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
