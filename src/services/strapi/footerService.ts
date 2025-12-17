import { strapiFetch } from "@/lib/strapi";
import { StrapiFooter } from "@/types/strapi/footer";
import qs from "qs";

export async function getFooter(): Promise<StrapiFooter | null> {
  const query = qs.stringify({
    populate: {
      topLinks: {
        populate: "*",
      },
      bottomLinks: {
        populate: "*",
      },
    },
  });

  const result = await strapiFetch(`/footer?${query}`, {
    next: { revalidate: 86400 },
  });
  return result.data?.data as StrapiFooter;
}
