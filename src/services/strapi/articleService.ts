import { strapiFetch } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import qs from "qs";

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
