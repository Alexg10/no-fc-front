import type {
  StrapiFetchOptions,
  StrapiFetchResult,
  StrapiProduct,
} from "@/types/strapi";
import { getLocale } from "next-intl/server";
import qs from "qs";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

export function getStrapiImageUrl(url: string | undefined): string {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const baseUrl = STRAPI_URL.replace(/\/$/, "");
  const imageUrl = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${imageUrl}`;
}

export async function strapiFetch(
  endpoint: string,
  options?: StrapiFetchOptions,
): Promise<StrapiFetchResult> {
  let url = `${STRAPI_URL}/api${endpoint}`;

  let locale = options?.locale;
  if (!locale) {
    try {
      locale = await getLocale();
    } catch {
      locale = undefined;
    }
  }

  if (locale) {
    const separator = endpoint.includes("?") ? "&" : "?";
    url = `${url}${separator}locale=${locale}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    ...options?.headers,
  };

  const { locale: _locale, ...fetchOptions } = options || {};

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    next: { revalidate: 60 },
  });

  // Pour les 404, retourner null au lieu de throw (locale peut ne pas exister)
  if (response.status === 404) {
    return { data: null, status: 404 };
  }

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return { data, status: response.status };
}

/**
 * Récupère une ressource Strapi avec fallback automatique vers EN
 * @param endpoint - L'endpoint Strapi (ex: "/articles?...")
 * @param locale - La locale pour récupérer la version traduite (optionnelle)
 * @param options - Options de fetch additionnelles (revalidate, headers, etc.)
 * @returns Le résultat du fetch
 */
export async function strapiFetchWithFallback(
  endpoint: string,
  locale?: string,
  options?: StrapiFetchOptions,
): Promise<StrapiFetchResult> {
  const result = await strapiFetch(endpoint, {
    locale,
    ...options,
  });

  // Si 404 ou data null/vide et pas FR, fallback vers FR (langue par défaut)
  const hasNoData =
    result.status === 404 || result.data === null || result.data?.data === null;

  if (hasNoData && locale && locale !== "en") {
    return strapiFetch(endpoint, {
      locale: "en",
      ...options,
    });
  }

  return result;
}

/**
 * Récupère un produit Strapi par son handle (correspond au handle Shopify)
 * @param handle - Le handle du produit (slug Shopify)
 * @param locale - La locale pour récupérer la version traduite (optionnelle, auto-détectée si omise)
 * @returns Le produit Strapi ou null si non trouvé
 */
export async function getProductByHandle(
  handle: string,
  locale?: string,
): Promise<StrapiProduct | null> {
  try {
    const filters = {
      handle: {
        $eq: handle,
      },
    };

    const populate = {
      blocks: {
        populate: "*",
        on: {
          "article.custom-container": {
            populate: {
              backgroundImage: {
                populate: "*",
              },
              image: {
                populate: "*",
              },
              quote: {
                populate: "*",
              },
              video: {
                populate: {
                  cover: {
                    populate: "*",
                  },
                },
              },
            },
          },
        },
      },
    };

    const queryString = qs.stringify(
      { filters, populate },
      {
        encodeValuesOnly: true,
        addQueryPrefix: true,
      },
    );

    let result = await strapiFetch(`/products${queryString}`, {
      ...(locale && { locale }),
    });
    if (result.status === 404 && locale !== "en") {
      result = await strapiFetch(`/products${queryString}`, { locale: "en" });
    }
    if (result.status === 404) {
      result = await strapiFetch(`/products${queryString}`);
    }

    const products = result.data?.data;
    if (products && Array.isArray(products) && products.length > 0) {
      return products[0] as StrapiProduct;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product from Strapi:", error);
    return null;
  }
}

export async function getStrapiEntity<T>(
  endpoint: string,
  options?: { populate?: string | string[] },
): Promise<T | null> {
  try {
    const params = new URLSearchParams();
    if (options?.populate) {
      const populateValue = Array.isArray(options.populate)
        ? options.populate.join(",")
        : options.populate;
      params.append("populate", populateValue);
    }

    const url = `/${endpoint}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const result = await strapiFetch(url);
    return (result.data?.data as T) || null;
  } catch (error) {
    console.error(`Error fetching ${endpoint} from Strapi:`, error);
    return null;
  }
}
