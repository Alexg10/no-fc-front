import { strapiFetchWithFallback, strapiQuery } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import qs from "qs";

/** Nombre d'articles par page sur la liste. */
export const ARTICLES_PAGE_SIZE = 12;

/**
 * Retourne la date effective d'un article :
 * le champ `date` (renseigné manuellement) s'il existe, sinon `publishedAt`.
 */
function getEffectiveDate(article: StrapiArticle): string {
  return article.date || article.publishedAt || "";
}

/**
 * Trie les articles du plus récent au plus ancien
 * en utilisant la date effective (date manuelle > publishedAt).
 */
function sortArticlesByDate(articles: StrapiArticle[]): StrapiArticle[] {
  return [...articles].sort((a, b) => {
    const dateA = new Date(getEffectiveDate(a)).getTime();
    const dateB = new Date(getEffectiveDate(b)).getTime();
    return dateB - dateA;
  });
}

export interface ArticlesPaginatedResult {
  articles: StrapiArticle[];
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export async function getArticlesPaginated(
  locale: string | undefined,
  page: number,
): Promise<ArticlesPaginatedResult> {
  const query = qs.stringify({
    pagination: {
      pageSize: 100,
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
    },
  });
  const result = await strapiFetchWithFallback(`/articles?${query}`, locale, {
    next: { revalidate: 3600 },
  });
  const allArticles = Array.isArray(result.data?.data) ? result.data.data : [];
  const sorted = sortArticlesByDate(
    allArticles as unknown as StrapiArticle[],
  );
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / ARTICLES_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * ARTICLES_PAGE_SIZE;
  const articles = sorted.slice(start, start + ARTICLES_PAGE_SIZE);

  return {
    articles,
    page: safePage,
    pageSize: ARTICLES_PAGE_SIZE,
    pageCount,
    total,
  };
}

export async function getArticles(locale?: string): Promise<StrapiArticle[]> {
  const query = qs.stringify({
    pagination: {
      pageSize: 100,
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
    },
  });
  const result = await strapiFetchWithFallback(`/articles?${query}`, locale, {
    next: { revalidate: 3600 },
  });
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return sortArticlesByDate(articles as unknown as StrapiArticle[]);
}

export async function getArticleBySlug(
  slug: string,
  locale?: string,
): Promise<StrapiArticle | null> {
  const query = strapiQuery({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      cover: {
        fields: ["url", "alternativeText", "width", "height", "formats"],
      },
      localizations: {
        fields: ["slug", "locale"],
      },
      seo: {
        populate: {
          metaImage: { fields: ["url", "alternativeText", "width", "height"] },
        },
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
  const result = await strapiFetchWithFallback(`/articles?${query}`, locale);
  const articles = Array.isArray(result.data?.data) ? result.data.data : [];
  return (articles[0] as unknown as StrapiArticle) ?? null;
}

export async function getLastArticle(
  locale?: string,
): Promise<StrapiArticle | null> {
  const articles = await getArticles(locale);
  return articles[0] ?? null;
}

export async function getPreviousTwoArticles(
  locale?: string,
): Promise<StrapiArticle[]> {
  const articles = await getArticles(locale);
  return articles.slice(0, 2);
}

export async function getOtherArticles(
  excludeSlug: string,
  limit: number = 2,
  locale?: string,
): Promise<StrapiArticle[]> {
  const articles = await getArticles(locale);
  return articles.filter((a) => a.slug !== excludeSlug).slice(0, limit);
}

export interface ArticlesArchive {
  title?: string;
}

export async function getArticlesArchive(
  locale?: string,
): Promise<ArticlesArchive | null> {
  const result = await strapiFetchWithFallback(`/articles-archive`, locale, {
    next: { revalidate: 3600 },
  });
  return (result.data?.data as ArticlesArchive) ?? null;
}
