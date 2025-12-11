import { strapiFetch } from "@/lib/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import qs from "qs";

export async function getMenu(): Promise<StrapiMenu | null> {
  const query = qs.stringify({
    populate: {
      links: {
        fields: ["label", "link", "target"],
      },
    },
  });

  const result = await strapiFetch(`/menu?${query}`, {
    next: { revalidate: 86400 },
  });
  return result.data?.data as StrapiMenu;
}
