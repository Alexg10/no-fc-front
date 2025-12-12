import { StrapiImage } from "@/types/strapi";

export interface StrapiArticle {
  id: number;
  title: string;
  content: string;
  cover: StrapiImage;
}
