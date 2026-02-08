import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiImage } from "@/types/strapi";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import qs from "qs";

export async function getContact(
  locale?: string
): Promise<StrapiContact | null> {
  const query = qs.stringify({
    populate: {
      backgroundImages: {
        fields: ["url", "width", "height"],
      },
    },
  });
  const result = await strapiFetchWithFallback(`/contact?${query}`, locale, {
    next: { revalidate: 86400 },
  });
  return result.data?.data as StrapiContact;
}

export interface StrapiContact {
  id: number;
  title: string;
  description: BlocksContent;
  privacy: BlocksContent;
  backgroundImages: StrapiImage[];
  thankYouTitle: string;
  thankYouDescription: BlocksContent;
}
