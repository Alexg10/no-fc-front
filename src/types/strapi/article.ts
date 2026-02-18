import { StrapiBlock, StrapiImage } from "@/types/strapi";
import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiArticle {
  id: number;
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  cover: StrapiImage;
  blocks?: StrapiBlock[];
  publishedAt?: string;
  shortDescription: BlocksContent;
  mainColor: ColorList;
  issueNumber: string;
  titleColor: ColorList | null;
}

export type ColorList = "blue" | "lime" | "pink" | "black" | "white" | "grey";
