import Grid from "@/components/common/grid/grid";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductCard } from "@/components/ui/product-card";
import {
  getCollectionProducts,
  getProductCollections,
  getProducts,
  type ShopifyProduct,
} from "@/lib/shopify";
import { getTranslations } from "next-intl/server";

interface RelatedProductsProps {
  productHandle: string;
  locale: string;
}

export async function RelatedProducts({
  productHandle,
  locale,
}: RelatedProductsProps) {
  const t = await getTranslations({ locale, namespace: "article" });

  // Récupérer les collections du produit courant
  const collections = await getProductCollections(productHandle);

  let relatedProducts: ShopifyProduct[] = [];
  let collectionHandle: string | null = null;

  // Chercher dans les collections des produits (en excluant le produit courant)
  for (const collection of collections) {
    const result = await getCollectionProducts(collection.handle, { first: 8 });
    const collectionProducts = result.edges
      .map((edge) => edge.node)
      .filter((p) => p.handle !== productHandle);

    if (collectionProducts.length >= 4) {
      relatedProducts = collectionProducts.slice(0, 4);
      collectionHandle = collection.handle;
      break;
    } else if (collectionProducts.length > 0 && relatedProducts.length === 0) {
      relatedProducts = collectionProducts;
      collectionHandle = collection.handle;
    }
  }

  // Si on n'a pas 4 produits, compléter avec des produits généraux
  if (relatedProducts.length < 4) {
    const needed = 4 - relatedProducts.length;
    const existingHandles = new Set([
      productHandle,
      ...relatedProducts.map((p) => p.handle),
    ]);

    const fallback = await getProducts({ first: needed + 5 });
    const fallbackProducts = fallback.edges
      .map((edge) => edge.node)
      .filter((p) => !existingHandles.has(p.handle))
      .slice(0, needed);

    relatedProducts = [...relatedProducts, ...fallbackProducts];
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  const href = collectionHandle
    ? `/collections/${collectionHandle}`
    : `/products`;

  return (
    <section className="py-10 lg:py-16">
      <Grid>
        <div className="col-span-full flex flex-col gap-10 lg:gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="heading-m-obviously uppercase">
              NOT MERCH.
              <br />
              CULTURE.
            </p>
            <ButtonLink href={href}>{t("seeMore")}</ButtonLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAboveFold={false}
              />
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
