import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import qs from "qs";

export async function getMenu(locale?: string): Promise<StrapiMenu | null> {
  const query = qs.stringify({
    populate: {
      links: {
        fields: ["label", "link", "target"],
      },
    },
  });

  const result = await strapiFetchWithFallback(`/menu?${query}`, locale, {
    next: { revalidate: 86400 },
  });

  return result.data?.data as StrapiMenu;
}
