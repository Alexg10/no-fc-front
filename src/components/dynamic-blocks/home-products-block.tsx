import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid/grid";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductCard } from "@/components/ui/product-card";
import { getProductByHandle } from "@/lib/shopify";
import type { StrapiHomeProducts } from "@/types/strapi";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import { getTranslations } from "next-intl/server";

interface HomeProductsBlockProps {
  block: StrapiHomeProducts;
  locale: string;
}

export async function HomeProductsBlock({
  block,
  locale,
}: HomeProductsBlockProps) {
  if (!block.products || block.products.length === 0) {
    return null;
  }
  const t = await getTranslations({ locale, namespace: "article" });

  const validProductHandles = block.products
    .map((p) => p.handle)
    .filter((handle): handle is string => Boolean(handle));

  if (validProductHandles.length === 0) {
    return null;
  }

  // Récupérer tous les produits en parallèle
  const productsPromises = validProductHandles.map((handle) =>
    getProductByHandle(handle).catch((error) => {
      console.error(
        `[HomeProductsBlock] Error fetching product ${handle}:`,
        error,
      );
      return null;
    }),
  );
  const products = await Promise.all(productsPromises);

  const validProducts = products
    .filter(
      (product): product is NonNullable<typeof product> => product !== null,
    )
    .map((product) => ({
      ...product,
      availableForSale: product.variants.edges.some(
        (edge) => edge.node.availableForSale,
      ),
    }));

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <Grid>
        <div className="col-span-full flex flex-col gap-10 lg:gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {block.title && (
              <BlockRendererClient
                content={block.title as unknown as BlocksContent}
                className="heading-m-obviously! [&>p]:heading-m-obviously! [&>*]:mb-0!"
              />
            )}
            <ButtonLink href={`/products`}>{t("seeMore")}</ButtonLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4  gap-6">
            {validProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isAboveFold={index < 8}
              />
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
