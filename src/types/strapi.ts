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

export interface StrapiLink {
  id: number;
  label: string;
  link: string;
  target?: string;
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

export interface StrapiSimplePageContent {
  __component: "simple-page.content";
  id: number;
  title?: string;
  content?: BlocksContent | string;
}

export interface StrapiArticleQuote {
  __component: "article.quote";
  id: number;
  quote?: BlocksContent;
  name?: string;
  description?: string;
}

export interface StrapiArticleDescription {
  __component: "article.description";
  id: number;
  description?: BlocksContent;
}

export interface StrapiArticleCarousel {
  __component: "article.carousel";
  id: number;
  images?: StrapiImage[];
}

export interface StrapiArticleTitleContent {
  __component: "article.title-content";
  id: number;
  title?: string;
  twoColumns?: boolean;
  image?: StrapiImage;
  content?: BlocksContent;
}

export interface StrapiArticleImages {
  __component: "article.images";
  id: number;
  images?: StrapiImage[];
}

export type StrapiBlock =
  | StrapiCenteredText
  | StrapiHomeProducts
  | StrapiSimplePageContent
  | StrapiArticleQuote
  | StrapiArticleDescription
  | StrapiArticleCarousel
  | StrapiArticleTitleContent
  | StrapiArticleImages;

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
