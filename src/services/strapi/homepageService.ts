import { strapiFetch } from "@/lib/strapi";
import { StrapiHomepage } from "@/types/strapi/homepage";
import qs from "qs";

export async function getHomepage(): Promise<StrapiHomepage | null> {
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

  const result = await strapiFetch(`/homepage?${query}`);
  return result.data?.data as StrapiHomepage;
}
