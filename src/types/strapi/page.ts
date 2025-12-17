import type { StrapiBlock } from "../strapi";

export interface StrapiPage {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  content?: string;
  blocks?: StrapiBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface StrapiPageResponse {
  data: StrapiPage[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
