import { getProductsPage } from "@/services/strapi/productsPageService";
import { CollectionsList } from "./collections-list";
import { ProductsPageHero } from "./products-page-hero";

export async function ProductsPageContent({ locale }: { locale: string }) {
  const productsPage = await getProductsPage(locale);

  if (!productsPage?.hero && !productsPage?.collections?.length) {
    return null;
  }

  return (
    <div className="space-y-12">
      {productsPage?.hero && <ProductsPageHero hero={productsPage.hero} />}
      {productsPage?.collections && (
        <div className="container mx-auto px-4">
          <CollectionsList collections={productsPage.collections} />
        </div>
      )}
    </div>
  );
}
