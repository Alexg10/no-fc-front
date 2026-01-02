import { strapiFetch } from "@/lib/strapi";
import { StrapiProductsPage } from "@/types/strapi/products-page";
import qs from "qs";

export async function getProductsPage(): Promise<StrapiProductsPage | null> {
  const query = qs.stringify({
    populate: {
      hero: {
        populate: {
          cover: true,
        },
      },
      collections: {
        populate: {
          fields: ["title"],
        },
      },
    },
  });

  const result = await strapiFetch(`/products-page?${query}`, {
    next: { revalidate: 3600 },
  });

  if (!result.data?.data) {
    return null;
  }

  return result.data.data as unknown as StrapiProductsPage;
}
