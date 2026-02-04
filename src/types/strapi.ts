import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { StrapiHomepageArticle } from "./strapi/homepage";
export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  caption?: string;
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

export interface StrapiMarquee {
  id: number;
  label: string;
  link: string;
}

export interface StrapiProduct {
  id: number;
  handle: string;
  title: string;
  description: BlocksContent;
  image: StrapiImage;
  price: number;
  available?: boolean;
  shopifyId: string;
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
  title?: BlocksContent;
  content?: BlocksContent | string;
  text?: string;
  button?: StrapiLink;
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

export interface StrapiArticleIntro {
  __component: "article.description";
  id: number;
  description?: BlocksContent;
}

export interface StrapiArticleCarousel {
  __component: "article.carousel";
  id: number;
  images?: StrapiImage[];
  backgroundColor?: "white" | "black" | "pink" | "lime" | "blue";
  backgroundImage?: StrapiImage;
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

export interface StrapiArticlesProduct {
  __component: "article.product";
  id: number;
  product?: StrapiProduct;
  backgroundImage?: StrapiImage;
}

export interface StrapiCommonVideoFullWidth {
  __component: "common.video-full-width";
  id: number;
  playerText?: string;
  url?: string;
  cover?: StrapiImage;
}

export interface StrapiSimplePageFaqs {
  __component: "simple-page.faqs";
  id: number;
  faqSections?: Array<{
    id: number;
    title: string;
    faqs?: Array<{
      id: number;
      question: string;
      answer: BlocksContent;
    }>;
  }>;
}

export interface StrapiHomepageNewestArticles {
  __component: "homepage.newest-articles";
  id: number;
  title?: BlocksContent;
}

export interface StrapiArticleImageCols {
  __component: "article.image-cols";
  id: number;
  image?: StrapiImage;
  imageRight?: boolean;
  content?: BlocksContent;
}

export interface StrapiArticleImageStack {
  __component: "article.image-stack";
  id: number;
  images?: StrapiImage[];
}

export interface StrapiArticleCredits {
  __component: "article.credits";
  id: number;
  credit?: Array<{
    id: number;
    title: string;
    content: BlocksContent;
  }>;
}

export interface StrapiArticleCustomContainer {
  __component: "article.custom-container";
  id: number;
  whiteText?: boolean;
  backgroundColor?: "white" | "black" | "pink" | "lime" | "blue";
  backgroundImage?: StrapiImage;
  title?: string;
  content?: BlocksContent;
  image?: StrapiImage;
}

export interface StrapiArticleLargeImage {
  __component: "article.large-image";
  id: number;
  image?: StrapiImage;
}

export interface StrapiArticleColumnsBlockItem {
  id: number;
  heading?: string;
  image?: StrapiImage;
  content?: BlocksContent;
}

export interface StrapiArticleColumnsColumnItem {
  id: number;
  columnBlockItem?: StrapiArticleColumnsBlockItem[];
}

export interface StrapiArticleColumns {
  __component: "article.columns-blocks";
  id: number;
  intro?: BlocksContent;
  column?: StrapiArticleColumnsColumnItem[];
}

export interface StrapiCommonSectionPush {
  __component: "common.section-push";
  id: number;
  title?: string;
  description?: BlocksContent;
  button?: StrapiLink;
  cover?: StrapiImage;
  whiteText?: boolean;
}

export type StrapiBlock =
  | StrapiCenteredText
  | StrapiHomeProducts
  | StrapiSimplePageContent
  | StrapiHomepageNewestArticles
  | StrapiArticleQuote
  | StrapiArticleIntro
  | StrapiArticleCarousel
  | StrapiArticleTitleContent
  | StrapiArticleImages
  | StrapiArticlesProduct
  | StrapiCommonVideoFullWidth
  | StrapiSimplePageFaqs
  | StrapiArticleImageCols
  | StrapiArticleImageStack
  | StrapiArticleCredits
  | StrapiArticleCustomContainer
  | StrapiArticleColumns
  | StrapiArticleLargeImage
  | StrapiCommonSectionPush;

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
