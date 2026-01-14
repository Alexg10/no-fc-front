import { strapiFetch } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import qs from "qs";

export async function getArticles(): Promise<StrapiArticle[]> {
  const query = qs.stringify({
    sort: ["publishedAt:desc"],
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
    },
  });
  const result = await strapiFetch(`/articles?${query}`, {
    next: { revalidate: 3600 },
  });
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return articles as unknown as StrapiArticle[];
}

export async function getArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
      blocks: {
        populate: "*",
      },
    },
  });
  const result = await strapiFetch(`/articles?${query}`);
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return articles[0] as unknown as StrapiArticle;
}

export async function getLastArticle(): Promise<StrapiArticle | null> {
  const query = qs.stringify({
    sort: ["publishedAt:desc"],
    pagination: {
      limit: 1,
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
    },
  });
  const result = await strapiFetch(`/articles?${query}`, {
    next: { revalidate: 3600 },
  });
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return articles[0] ? (articles[0] as unknown as StrapiArticle) : null;
}

export async function getPreviousTwoArticles(): Promise<StrapiArticle[]> {
  const query = qs.stringify({
    sort: ["publishedAt:desc"],
    pagination: {
      start: 1,
      limit: 2,
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
    },
  });
  const result = await strapiFetch(`/articles?${query}`, {
    next: { revalidate: 3600 },
  });
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return articles as unknown as StrapiArticle[];
}
