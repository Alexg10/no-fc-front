import { ProductCard } from "@/components/ui/product-card";
import { getProductByHandle } from "@/lib/shopify";
import type { StrapiHomeProducts } from "@/types/strapi";

interface HomeProductsBlockProps {
  block: StrapiHomeProducts;
}

export async function HomeProductsBlock({ block }: HomeProductsBlockProps) {
  if (!block.products || block.products.length === 0) {
    return null;
  }

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
        error
      );
      return null;
    })
  );
  const products = await Promise.all(productsPromises);

  const validProducts = products.filter(
    (product): product is NonNullable<typeof product> => product !== null
  );

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {block.title && (
        <h2 className="text-3xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
          {block.title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            isAboveFold={index < 8}
          />
        ))}
      </div>
    </section>
  );
}
