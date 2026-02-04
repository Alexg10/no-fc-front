import { strapiFetch } from "@/lib/strapi";
import { StrapiLink, StrapiMarquee } from "@/types/strapi";
import qs from "qs";

export async function getGeneral(): Promise<StrapiGeneral | null> {
  const query = qs.stringify({
    populate: {
      socials: {
        fields: ["label", "link", "target"],
      },
      marquee: {
        fields: ["label", "link"],
      },
    },
  });
  const result = await strapiFetch(`/general?${query}`, {
    next: { revalidate: 86400 },
  });

  return result.data?.data as StrapiGeneral;
}

export interface StrapiGeneral {
  id: number;
  socials: Array<StrapiLink>;
  marquee: StrapiMarquee;
}
