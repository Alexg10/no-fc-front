import { strapiFetchWithFallback } from "@/lib/strapi";
import { StrapiProductsPage } from "@/types/strapi/products-page";
import qs from "qs";

export async function getProductsPage(
  locale?: string,
): Promise<StrapiProductsPage | null> {
  const query = qs.stringify({
    populate: {
      hero: {
        populate: {
          cover: true,
        },
      },
      collections: true,
    },
  });

  const result = await strapiFetchWithFallback(
    `/products-page?${query}`,
    locale,
    {
      next: { revalidate: 3600 },
    },
  );

  return (result.data?.data as unknown as StrapiProductsPage) ?? null;
}
