import { ProductsContent } from "@/components/products/products-content";
import { ProductsPageLoading } from "@/components/skeleton/products-page-loading";
import type { Metadata } from "next";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    after?: string;
    before?: string;
    collection?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    available?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Tous les produits | NOFC",
  description:
    "Découvrez notre sélection complète de produits de qualité. Parcourez notre catalogue et trouvez ce qui vous convient.",
  openGraph: {
    title: "Tous les produits | NOFC",
    description:
      "Découvrez notre sélection complète de produits de qualité sur NOFC.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: {
    canonical: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/products`,
  },
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductsPageLoading />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
