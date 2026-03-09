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
              fields: [
                "title",
                "slug",
                "mainColor",
                "titleColor",
                "issueNumber",
                "shortDescription",
              ],
              populate: {
                cover: {
                  fields: ["url", "alternativeText", "width", "height"],
                },
              },
            },
          },
        },
        blocks: {
          populate: "*",
          on: {
            "homepage.newest-articles": {
              fields: ["title"],
            },
            "homepage.home-products": {
              fields: ["title"],
              populate: {
                products: { fields: ["handle"] },
              },
            },
            "common.centered-text": {
              populate: {
                button: { fields: ["label", "link", "target"] },
              },
            },
            "common.video-full-width": {
              fields: ["playerText", "url"],
              populate: {
                cover: { fields: ["url", "alternativeText", "width", "height"] },
              },
            },
            "common.section-push": {
              fields: ["title", "whiteText"],
              populate: {
                button: { fields: ["label", "link", "target"] },
                cover: { fields: ["url", "alternativeText", "width", "height"] },
              },
            },
          },
        },
      },
    },
  );

  const result = await strapiFetchWithFallback(`/homepage?${query}`, locale, {
    next: { revalidate: 3600 },
  });

  return result.data?.data as StrapiHomepage;
}
