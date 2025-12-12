import { StrapiBlock, StrapiImage, StrapiSeo } from "@/types/strapi";
import { StrapiArticle } from "@/types/strapi/article";

export interface StrapiHomepage {
  id: number;
  seo: StrapiSeo;
  heroArticle: StrapiHomepageArticle;
  blocks: StrapiBlock[];
}

export interface StrapiHomepageArticle {
  id: number;
  slug: string;
  title: string;
  cover?: StrapiImage;
  article?: StrapiArticle;
}
