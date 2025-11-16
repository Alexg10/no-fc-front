import type { StrapiHomepage, StrapiProduct } from "@/types/strapi";
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

async function strapiFetch(endpoint: string, options?: RequestInit) {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    ...options?.headers,
  };
  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function getHomepage(): Promise<StrapiHomepage | null> {
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

    const data = await strapiFetch(`/homepage${queryString}`);
    return data.data || null;
  } catch (error) {
    console.error("Error fetching homepage from Strapi:", error);
    return null;
  }
}

/**
 * Récupère un produit Strapi par son handle (correspond au handle Shopify)
 * @param handle - Le handle du produit (slug Shopify)
 * @returns Le produit Strapi ou null si non trouvé
 */
export async function getProductByHandle(
  handle: string
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

    const data = await strapiFetch(`/products${queryString}`);

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0] as StrapiProduct;
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
    const data = await strapiFetch(url);
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching ${endpoint} from Strapi:`, error);
    return null;
  }
}
