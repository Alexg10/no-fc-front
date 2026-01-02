import { StrapiImage } from "@/types/strapi";

export interface StrapiProductsPageHero {
  id: number;
  title?: string;
  description?: string;
  cover?: StrapiImage;
  btnLabel?: string;
  btnLink?: string;
}

export interface StrapiCollection {
  id: number;
  title: string;
  handle: string;
}

export interface StrapiProductsPage {
  id: number;
  hero?: StrapiProductsPageHero;
  collections?: StrapiCollection[];
}
