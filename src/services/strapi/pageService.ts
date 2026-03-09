import { strapiFetch } from "@/lib/strapi";
import type { StrapiPage, StrapiPageResponse } from "@/types/strapi/page";
import qs from "qs";

export async function getPageBySlug(
  slug: string,
  locale: string = "en",
): Promise<StrapiPage | null> {
  try {
    const query = qs.stringify({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        localizations: {
          fields: ["slug", "locale"],
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
          },
        },
      },
      locale,
    });

    const result = await strapiFetch(`/pages?${query}`, {
      next: { revalidate: 3600 },
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
