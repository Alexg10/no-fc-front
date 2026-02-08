import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiHomepage } from "@/types/strapi/homepage";
import qs from "qs";

export async function getHomepage(
  locale?: string
): Promise<StrapiHomepage | null> {
  const query = qs.stringify(
    {
      populate: {
        seo: {
          fields: ["metaTitle", "metaDescription", "keywords"],
        },
        heroArticle: {
          populate: {
            article: {
              populate: "*",
            },
          },
        },
        blocks: {
          populate: "*",
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const result = await strapiFetchWithFallback(`/homepage?${query}`, locale, {
    next: { revalidate: 3600 },
  });

  return result.data?.data as StrapiHomepage;
}
