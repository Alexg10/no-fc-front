import { Link } from "@/lib/navigation";
import { StrapiCollection } from "@/types/strapi/products-page";

interface CollectionsListProps {
  collections: StrapiCollection[];
}

export function CollectionsList({ collections }: CollectionsListProps) {
  if (!collections.length) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group"
            >
              <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {collection.title}
                  </h3>
                  <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                    View Collection →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
