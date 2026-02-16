"use client";

import { Link, usePathname } from "@/lib/navigation";
import { StrapiCollection } from "@/types/strapi/products-page";
import { useTranslations } from "next-intl";

interface CollectionsListProps {
  collections: StrapiCollection[];
}

export function CollectionsList({ collections }: CollectionsListProps) {
  const t = useTranslations("collections");
  const pathname = usePathname();

  if (!collections.length) {
    return null;
  }

  const isActive = (handle: string) => pathname === `/collections/${handle}`;
  const isAllCollections =
    pathname === "/products" || pathname === "/collections/";

  return (
    <section className="pb-6 lg:pb-12">
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 lg:gap-6 justify-center">
          <Link
            href={`/products/`}
            className={isAllCollections ? "opacity-40" : ""}
          >
            <div className="overflow-hidden flex flex-col">
              <h3 className="text-s-polymath transition-colors">
                {t("allCollections")}
              </h3>
            </div>
          </Link>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className={isActive(collection.handle) ? "opacity-40" : "group"}
            >
              <div className="overflow-hidden flex flex-col">
                <h3 className="text-s-polymath transition-colors">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
