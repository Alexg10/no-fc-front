"use server";

import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2024-10",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

export interface CartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: CartLineItem;
    }>;
  };
}

// Requête GraphQL pour créer un panier
const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_QUERY = `
  query getCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Crée un nouveau panier
 */
export async function createCart(): Promise<Cart | null> {
  try {
    const response = await client.request(CART_CREATE, {
      variables: {
        input: {},
      },
    });

    if (response.data?.cartCreate?.cart) {
      return response.data.cartCreate.cart as Cart;
    }

    return null;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
}

/**
 * Ajoute un article au panier
 */
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart | null> {
  try {
    const response = await client.request(CART_LINES_ADD, {
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    });

    if (response.data?.cartLinesAdd?.cart) {
      return response.data.cartLinesAdd.cart as Cart;
    }

    return null;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

/**
 * Met à jour la quantité d'un article dans le panier
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    const response = await client.request(CART_LINES_UPDATE, {
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      },
    });

    if (response.data?.cartLinesUpdate?.cart) {
      return response.data.cartLinesUpdate.cart as Cart;
    }

    return null;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
}

/**
 * Supprime un article du panier
 */
export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<Cart | null> {
  try {
    const response = await client.request(CART_LINES_REMOVE, {
      variables: {
        cartId,
        lineIds: [lineId],
      },
    });

    if (response.data?.cartLinesRemove?.cart) {
      return response.data.cartLinesRemove.cart as Cart;
    }

    return null;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

/**
 * Récupère un panier par son ID
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const response = await client.request(CART_QUERY, {
      variables: {
        id: cartId,
      },
    });

    if (response.data?.cart) {
      return response.data.cart as Cart;
    }

    return null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}
