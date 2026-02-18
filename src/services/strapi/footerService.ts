import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiFooter } from "@/types/strapi/footer";
import qs from "qs";

export async function getFooter(locale?: string): Promise<StrapiFooter | null> {
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
    next: { revalidate: 86400 },
  });

  return result.data?.data as StrapiFooter;
}
