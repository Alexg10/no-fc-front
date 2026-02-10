import { strapiFetchWithFallback } from "@/lib/strapi";
import type { StrapiAboutContent } from "@/types/strapi";
import qs from "qs";

export async function getAboutContent(
  locale?: string,
): Promise<StrapiAboutContent | null> {
  const query = qs.stringify({
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
