import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// Initialisation du client Shopify
const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2026-01",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

// Types pour les produits Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
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
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
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
  compareAtPriceRange: {
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
  cursor: string;
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ShopifyProductsResponse {
  edges: ShopifyProductEdge[];
  pageInfo: ShopifyPageInfo;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
}

export interface ShopifyCollectionEdge {
  node: ShopifyCollection;
}

export interface ShopifyCollectionsResponse {
  edges: ShopifyCollectionEdge[];
}

export interface ShopifyProductImages {
  id: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      };
    }>;
  };
}

// Requête GraphQL pour récupérer un produit par handle
const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!, $language: LanguageCode) @inContext(language: $language) {
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
            compareAtPrice {
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
      compareAtPriceRange {
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

// Type minimal pour les images du produit depuis Shopify
const GET_PRODUCT_IMAGES = `
  query getProductImages($handle: String!) {
    product(handle: $handle) {
      id
      handle
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// Requête GraphQL pour récupérer la liste des produits avec pagination, filtres et tri
const GET_PRODUCTS = `
  query getProducts(
    $first: Int
    $after: String
    $before: String
    $last: Int
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first
      after: $after
      before: $before
      last: $last
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          createdAt
          images(first: 5) {
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
          compareAtPriceRange {
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
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Requête GraphQL pour récupérer les collections
const GET_COLLECTIONS = `
  query getCollections($first: Int) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
        }
      }
    }
  }
`;

// Requête GraphQL pour récupérer les produits d'une collection
const GET_COLLECTION_PRODUCTS = `
  query getCollectionProducts(
    $handle: String!
    $first: Int
    $after: String
    $before: String
    $last: Int
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(
        first: $first
        after: $after
        before: $before
        last: $last
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            createdAt
            images(first: 5) {
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
            compareAtPriceRange {
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
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/**
 * Convertit une locale (ex: "fr", "en") en LanguageCode Shopify (ex: "FR", "EN")
 */
function toShopifyLanguage(locale?: string): string | undefined {
  if (!locale) return undefined;
  return locale.toUpperCase();
}

/**
 * Récupère un produit par son handle
 * @param handle - Le handle du produit (slug)
 * @param locale - La locale pour récupérer la version traduite
 * @returns Le produit ou null si non trouvé
 */
export async function getProductByHandle(
  handle: string,
  locale?: string,
): Promise<ShopifyProduct | null> {
  try {
    const language = toShopifyLanguage(locale);
    const response = await client.request(GET_PRODUCT_BY_HANDLE, {
      variables: { handle, language },
    });

    if (response.data?.product) {
      const product = response.data.product as ShopifyProduct;
      return product;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

/**
 * Récupère uniquement les images d'un produit par son handle (requête optimisée)
 * @param handle - Le handle du produit (slug)
 * @returns Les images du produit ou null si non trouvé
 */
export async function getProductImages(
  handle: string,
): Promise<ShopifyProductImages | null> {
  try {
    const response = await client.request(GET_PRODUCT_IMAGES, {
      variables: { handle },
    });

    if (response.data?.product) {
      return response.data.product as ShopifyProductImages;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
}

export type ProductSortKey =
  | "TITLE"
  | "PRICE"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "RELEVANCE"
  | "ID";

export interface GetProductsOptions {
  first?: number;
  after?: string;
  before?: string;
  last?: number;
  collection?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
}

/**
 * Récupère la liste des produits avec pagination, filtres et tri
 */
export async function getProducts(
  options: GetProductsOptions = {},
): Promise<ShopifyProductsResponse> {
  try {
    const {
      first = 12,
      after,
      before,
      last,
      collection,
      sortKey,
      reverse = false,
      minPrice,
      maxPrice,
      availableOnly,
    } = options;

    // Construire la requête de filtre
    const queryParts: string[] = [];

    if (collection) {
      queryParts.push(`collection:${collection}`);
    }

    if (minPrice !== undefined) {
      queryParts.push(`variants.price:>=${minPrice}`);
    }

    if (maxPrice !== undefined) {
      queryParts.push(`variants.price:<=${maxPrice}`);
    }

    if (availableOnly) {
      queryParts.push("available_for_sale:true");
    }

    const query = queryParts.length > 0 ? queryParts.join(" AND ") : undefined;

    const variables: {
      first?: number;
      after?: string | null;
      before?: string | null;
      last?: number;
      query?: string;
      sortKey?: ProductSortKey;
      reverse?: boolean;
    } = {};

    if (before && last) {
      variables.before = before;
      variables.last = last;
    } else {
      variables.first = first;
      variables.after = after || null;
    }

    if (query) {
      variables.query = query;
    }

    if (sortKey) {
      variables.sortKey = sortKey;
    }

    if (reverse) {
      variables.reverse = reverse;
    }

    const response = await client.request(GET_PRODUCTS, {
      variables,
    });

    if (response.data?.products) {
      return {
        edges: response.data.products.edges as ShopifyProductEdge[],
        pageInfo: response.data.products.pageInfo as ShopifyPageInfo,
      };
    }

    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Récupère toutes les collections
 */
export async function getCollections(
  first: number = 50,
): Promise<ShopifyCollectionsResponse> {
  try {
    const response = await client.request(GET_COLLECTIONS, {
      variables: { first },
    });

    if (response.data?.collections) {
      return {
        edges: response.data.collections.edges as ShopifyCollectionEdge[],
      };
    }

    return { edges: [] };
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
}

/**
 * Récupère les produits d'une collection avec pagination et tri
 */
export async function getCollectionProducts(
  handle: string,
  options: {
    first?: number;
    after?: string;
    before?: string;
    last?: number;
    sortKey?: ProductSortKey;
    reverse?: boolean;
  } = {},
): Promise<ShopifyProductsResponse & { collection?: ShopifyCollection }> {
  try {
    const {
      first = 12,
      after,
      before,
      last,
      sortKey,
      reverse = false,
    } = options;

    const variables: {
      handle: string;
      first?: number;
      after?: string | null;
      before?: string | null;
      last?: number;
      sortKey?: ProductSortKey;
      reverse?: boolean;
    } = {
      handle,
    };

    if (before && last) {
      variables.before = before;
      variables.last = last;
    } else {
      variables.first = first;
      variables.after = after || null;
    }

    if (sortKey) {
      variables.sortKey = sortKey;
    }

    if (reverse) {
      variables.reverse = reverse;
    }

    const response = await client.request(GET_COLLECTION_PRODUCTS, {
      variables,
    });

    if (response.data?.collection?.products) {
      return {
        edges: response.data.collection.products.edges as ShopifyProductEdge[],
        pageInfo: response.data.collection.products.pageInfo as ShopifyPageInfo,
        collection: {
          id: response.data.collection.id,
          title: response.data.collection.title,
          handle: response.data.collection.handle,
          description: response.data.collection.description || "",
        },
      };
    }

    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  } catch (error) {
    console.error("Error fetching collection products:", error);
    throw error;
  }
}
