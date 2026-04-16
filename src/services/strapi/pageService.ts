import { strapiFetch, strapiQuery } from "@/lib/strapi";
import type { StrapiPage, StrapiPageResponse } from "@/types/strapi/page";

export async function getPageBySlug(
  slug: string,
  locale: string = "en",
): Promise<StrapiPage | null> {
  try {
    const query = strapiQuery({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        localizations: {
          fields: ["slug", "locale"],
        },
        seo: {
          populate: {
            metaImage: {
              fields: ["url", "alternativeText", "width", "height"],
            },
          },
        },
        blocks: {
          populate: "*",
          on: {
            "simple-page.faqs": {
              populate: {
                faqSections: {
                  populate: "*",
                },
              },
            },
            "simple-page.content": {
              populate: {
                populate: "*",
              },
            },
            "common.table-grid": {
              populate: "*",
            },
          },
        },
      },
      locale,
    });

    const result = await strapiFetch(`/pages?${query}`, {
      next: { revalidate: 60 },
    });

    const pageData = result.data as StrapiPageResponse | null;
    if (!pageData?.data?.[0]) {
      if (locale !== "en") {
        return getPageBySlug(slug, "en");
      }
      return null;
    }

    return pageData.data[0] as StrapiPage;
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error);
    return null;
  }
}
