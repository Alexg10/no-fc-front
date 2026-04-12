import type {
  StrapiFetchOptions,
  StrapiFetchResult,
  StrapiProduct,
} from "@/types/strapi";
import { getLocale } from "next-intl/server";
import qs from "qs";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

/**
 * Stringify un objet en query string compatible Strapi.
 * Préserve le `*` dans `populate: "*"` (ne l'encode pas en %2A).
 */
export function strapiQuery(params: Record<string, unknown>): string {
  return qs.stringify(params, {
    encodeValuesOnly: true,
    encoder: (str, defaultEncoder, charset) => {
      if (str === "*") return "*";
      return defaultEncoder(str, defaultEncoder, charset);
    },
  });
}

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
    next: { revalidate: 60, ...fetchOptions.next },
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

  const text = await response.text();
  if (!text) {
    return { data: null, status: response.status };
  }

  try {
    const data = JSON.parse(text);
    return { data, status: response.status };
  } catch {
    console.error("Strapi returned invalid JSON:", text.slice(0, 200));
    return { data: null, status: response.status };
  }
}

/**
 * Récupère une ressource Strapi avec fallback automatique vers EN
 * @param endpoint - L'endpoint Strapi (ex: "/articles?...")
 * @param locale - La locale pour récupérer la version traduite (optionnelle)
 * @param options - Options de fetch additionnelles (revalidate, headers, etc.)
 * @returns Le résultat du fetch
 */
const STRAPI_BASE_KEYS = new Set([
  "id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
]);

function hasData(result: StrapiFetchResult): boolean {
  if (result.status === 404 || result.data === null || result.data?.data === null) {
    return false;
  }
  const data = result.data?.data;
  if (typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data);
    const hasContentKeys = keys.some((k) => !STRAPI_BASE_KEYS.has(k));
    return hasContentKeys;
  }
  return true;
}

// "fr" → "fr-FR", "fr-FR" → "fr"
function getAlternateLocale(locale: string): string | null {
  if (locale.includes("-")) return locale.split("-")[0];
  const regionMap: Record<string, string> = { fr: "fr-FR", en: "en-US" };
  return regionMap[locale] || null;
}

export async function strapiFetchWithFallback(
  endpoint: string,
  locale?: string,
  options?: StrapiFetchOptions,
): Promise<StrapiFetchResult> {
  const result = await strapiFetch(endpoint, {
    locale,
    ...options,
  });

  if (hasData(result)) return result;

  // Essayer la variante de locale (fr → fr-FR ou fr-FR → fr)
  if (locale) {
    const alternate = getAlternateLocale(locale);
    if (alternate) {
      const altResult = await strapiFetch(endpoint, {
        locale: alternate,
        ...options,
      });
      if (hasData(altResult)) return altResult;
    }
  }

  // Fallback vers en (langue par défaut Strapi)
  if (locale && locale !== "en" && locale !== "en-US") {
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

    const queryString = `?${strapiQuery({ filters, populate })}`;

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
