import { ProductsPageHero } from "./products-page-hero";

interface ProductsPageHeroSectionProps {
  hero?: {
    id: number;
    title?: string;
    description?: string;
    cover?: { id: number; url: string; alternativeText?: string };
    btnLabel?: string;
    btnLink?: string;
  };
}

export async function ProductsPageHeroSection({
  hero,
}: ProductsPageHeroSectionProps) {
  if (!hero) {
    return null;
  }

  return <ProductsPageHero hero={hero} />;
}
