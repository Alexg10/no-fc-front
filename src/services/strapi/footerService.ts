import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiFooter } from "@/types/strapi/footer";
import qs from "qs";

export async function getFooter(locale?: string): Promise<StrapiFooter | null> {
  try {
    const query = qs.stringify({
      populate: {
        topLinks: {
          fields: ["label", "link", "target"],
        },
        bottomLinks: {
          fields: ["label", "link", "target"],
        },
      },
    });

    const result = await strapiFetchWithFallback(`/footer?${query}`, locale, {
      next: { revalidate: 60 },
    });

    return result.data?.data as StrapiFooter;
  } catch (error) {
    console.error("Failed to fetch footer from Strapi:", error);
    return null;
  }
}
