import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiLink, StrapiMarquee } from "@/types/strapi";
import { StrapiCollection } from "@/types/strapi/products-page";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import qs from "qs";

export async function getGeneral(
  locale?: string,
): Promise<StrapiGeneral | null> {
  const query = qs.stringify({
    populate: {
      socials: {
        fields: ["label", "link", "target"],
      },
      marquee: {
        fields: ["label", "link"],
      },
      bottomMarquee: {
        fields: ["firstText", "secondText"],
      },
      shippingInfos: {
        fields: ["title", "content"],
      },
      selectedCollections: {
        fields: ["title", "handle", "nbProductToShow"],
      },
    },
  });
  const result = await strapiFetchWithFallback(`/general?${query}`, locale, {
    next: { revalidate: 86400 },
  });

  return result.data?.data as StrapiGeneral;
}

interface StrapiBottomMarquee {
  firstText: string;
  secondText: string;
}

export interface StrapiShippingInfos {
  title: string;
  content: BlocksContent;
}

export interface StrapiGeneral {
  id: number;
  socials: Array<StrapiLink>;
  marquee: StrapiMarquee;
  bottomMarquee: StrapiBottomMarquee;
  shippingInfos: StrapiShippingInfos;
  selectedCollections: Array<StrapiCollection>;
}
