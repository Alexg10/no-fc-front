import { StrapiBlock, StrapiImage } from "@/types/strapi";

export interface StrapiArticle {
  id: number;
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  cover: StrapiImage;
  blocks?: StrapiBlock[];
  publishedAt?: string;
}
