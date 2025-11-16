import type {
  StrapiFetchOptions,
  StrapiFetchResult,
  StrapiHomepage,
  StrapiProduct,
} from "@/types/strapi";
import qs from "qs";

// Configuration Strapi
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

async function strapiFetch(
  endpoint: string,
  options?: StrapiFetchOptions
): Promise<StrapiFetchResult> {
  let url = `${STRAPI_URL}/api${endpoint}`;

  // Ajouter le paramètre locale si fourni
  if (options?.locale) {
    const separator = endpoint.includes("?") ? "&" : "?";
    url = `${url}${separator}locale=${options.locale}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    ...options?.headers,
  };

  // Extraire locale des options pour ne pas le passer à fetch
  const { locale, ...fetchOptions } = options || {};

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
      `Strapi API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return { data, status: response.status };
}

export async function getHomepage(
  locale: string
): Promise<StrapiHomepage | null> {
  try {
    const populate = {
      seo: {
        fields: ["metaTitle", "metaDescription", "keywords"],
      },
      hero: {
        populate: {
          fields: ["title", "subtitle", "description"],
          background: {
            populate: "*",
            fields: ["alternativeText", "formats", "url"],
          },
          button: {
            populate: "*",
            fields: ["label", "link", "target"],
          },
        },
      },
      blocks: {
        populate: "*",
      },
    };

    const queryString = qs.stringify(
      { populate },
      {
        encodeValuesOnly: true,
        addQueryPrefix: true,
      }
    );

    let result = await strapiFetch(`/homepage${queryString}`, { locale });

    if (result.status === 404 && locale !== "fr") {
      result = await strapiFetch(`/homepage${queryString}`, { locale: "fr" });
    }
    if (result.status === 404) {
      result = await strapiFetch(`/homepage${queryString}`);
    }

    return (result.data?.data as StrapiHomepage) || null;
  } catch (error) {
    console.error("Error fetching homepage from Strapi:", error);
    return null;
  }
}

/**
 * Récupère un produit Strapi par son handle (correspond au handle Shopify)
 * @param handle - Le handle du produit (slug Shopify)
 * @param locale - La locale pour récupérer la version traduite
 * @returns Le produit Strapi ou null si non trouvé
 */
export async function getProductByHandle(
  handle: string,
  locale: string
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
      },
    };

    const queryString = qs.stringify(
      { filters, populate },
      {
        encodeValuesOnly: true,
        addQueryPrefix: true,
      }
    );

    let result = await strapiFetch(`/products${queryString}`, { locale });
    if (result.status === 404 && locale !== "fr") {
      result = await strapiFetch(`/products${queryString}`, { locale: "fr" });
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
  options?: { populate?: string | string[] }
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
