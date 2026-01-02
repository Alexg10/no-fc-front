import { StrapiCollection } from "@/types/strapi/products-page";
import { CollectionsList } from "./collections-list";

interface CollectionsSectionProps {
  collections?: StrapiCollection[];
}

export async function CollectionsSection({
  collections,
}: CollectionsSectionProps) {
  if (!collections?.length) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <CollectionsList collections={collections} />
    </div>
  );
}
