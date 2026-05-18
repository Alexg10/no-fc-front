import { strapiQuery, strapiFetchWithFallback } from "@/lib/strapi";
import type { StrapiAboutContent } from "@/types/strapi";

export async function getAboutContent(
  locale?: string,
): Promise<StrapiAboutContent | null> {
  const query = strapiQuery({
    populate: {
      blocks: {
        populate: "*",
      },
    },
  });
  const result = await strapiFetchWithFallback(`/about?${query}`, locale, {
    next: { revalidate: 86400 },
  });

  return result.data?.data as StrapiAboutContent;
}
