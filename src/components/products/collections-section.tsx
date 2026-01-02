import { CollectionsList } from "./collections-list";

interface CollectionsSectionProps {
  collections?: Array<{
    id: number;
    name: string;
    handle: string;
    description?: string;
    image?: { id: number; url: string; alternativeText?: string };
  }>;
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
