import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { StrapiHomepageArticle } from "./strapi/homepage";
export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    large: {
      url: string;
    };
  };
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

export interface StrapiHomeProducts {
  __component: "homepage.home-products";
  id: number;
  title?: string;
  products?: Array<{
    id: number;
    handle: string;
  }>;
}

export type StrapiBlock = StrapiCenteredText | StrapiHomeProducts;

export interface StrapiProduct {
  id: number;
  handle: string;
  blocks?: StrapiBlock[];
}

export interface StrapiHomepage {
  id: number;
  heroArticle?: StrapiHomepageArticle;
  blocks?: StrapiBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}

export interface StrapiFetchOptions extends RequestInit {
  locale?: string;
}

export interface StrapiApiResponse {
  data: unknown;
  meta?: unknown;
}

export interface StrapiFetchResult {
  data: StrapiApiResponse | null;
  status: number;
}

export interface StrapiSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}
