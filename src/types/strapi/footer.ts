import { StrapiLink } from "@/types/strapi";

export interface StrapiFooter {
  id: number;
  topLinks: Array<StrapiLink>;
  bottomLinks: Array<StrapiLink>;
}
