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
  slug: string,
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
        on: {
          "article.columns-blocks": {
            populate: {
              column: {
                populate: {
                  columnBlockItem: {
                    populate: "*",
                  },
                },
              },
            },
          },
          "article.quote": {
            populate: "*",
          },
          "article.description": {
            populate: "*",
          },
          "article.carousel": {
            populate: "*",
          },
          "article.title-content": {
            populate: "*",
          },
          "article.images": {
            populate: "*",
          },
          "article.image-cols": {
            populate: "*",
          },
          "article.image-stack": {
            populate: "*",
          },
          "article.product": {
            populate: "*",
          },
          "article.credits": {
            populate: "*",
          },
          "article.custom-container": {
            populate: "*",
          },
          "article.large-image": {
            populate: "*",
          },
        },
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

export async function getOtherArticles(
  excludeSlug: string,
  limit: number = 2,
): Promise<StrapiArticle[]> {
  const query = qs.stringify({
    filters: {
      slug: {
        $ne: excludeSlug,
      },
    },
    sort: ["publishedAt:desc"],
    pagination: {
      limit,
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
