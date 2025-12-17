import {
  StrapiBlock,
  StrapiImage,
  StrapiLink,
  StrapiSeo,
} from "@/types/strapi";
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

export interface StrapiHomepageHero {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  button: StrapiLink;
  background: StrapiImage;
}
