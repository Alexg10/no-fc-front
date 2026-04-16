import { strapiFetchWithFallback, strapiQuery } from "@/lib/strapi";
import { StrapiHomepage } from "@/types/strapi/homepage";

export async function getHomepage(
  locale?: string,
): Promise<StrapiHomepage | null> {
  const query = strapiQuery({
    populate: {
      seo: {
        populate: {
          metaImage: { fields: ["url", "alternativeText", "width", "height"] },
        },
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
              cover: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
          "common.section-push": {
            fields: ["title", "whiteText"],
            populate: {
              button: { fields: ["label", "link", "target"] },
              cover: {
                fields: ["url", "alternativeText", "width", "height"],
              },
              coverMobile: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
        },
      },
    },
  });

  const result = await strapiFetchWithFallback(`/homepage?${query}`, locale, {
    next: { revalidate: 60 },
  });

  return result.data?.data as StrapiHomepage;
}
