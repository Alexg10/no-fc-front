import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface StrapiHomepageHero {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: StrapiImage;
  background?: StrapiImage;
  button?: {
    label: string;
    link: string;
    target?: string;
  };
  ctaText?: string;
  ctaLink?: string;
}

export interface StrapiHomepageSection {
  id: number;
  title?: string;
  content?: string;
  image?: StrapiImage;
  type: "text" | "image" | "products" | "collections";
  products?: Array<{
    id: string;
    handle: string;
  }>;
  collections?: Array<{
    id: string;
    handle: string;
  }>;
}

export interface StrapiCenteredText {
  __component: "common.centered-text";
  id: number;
  title?: string;
  content?: BlocksContent | string;
  text?: string;
}

export type StrapiBlock = StrapiCenteredText;

export interface StrapiHomepage {
  id: number;
  hero?: StrapiHomepageHero;
  blocks?: StrapiBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}
