import { ProductCard } from "@/components/ui/product-card";
import { getCollectionProducts } from "@/lib/shopify";

interface ArticleCollectionProps {
  collectionHandle: string;
  title?: string;
  limit?: number;
}

export async function ArticleCollection({
  collectionHandle,
  title,
  limit = 4,
}: ArticleCollectionProps) {
  try {
    const response = await getCollectionProducts(collectionHandle, {
      first: limit,
    });

    const products = response.edges?.map((edge) => edge.node) ?? [];

    if (!products.length) {
      return (
        <div className="py-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            No products in this collection
          </p>
        </div>
      );
    }

    return (
      <section className="space-y-6">
        {(title || response.collection?.title) && (
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">
              {title || response.collection?.title}
            </h2>
            {response.collection?.description && (
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {response.collection.description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isAboveFold={index < limit}
            />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error(
      `Error fetching collection products for ${collectionHandle}:`,
      error
    );
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          Error loading collection
        </p>
      </div>
    );
  }
}
