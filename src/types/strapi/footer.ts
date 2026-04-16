import { StrapiLink } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface StrapiFooter {
  id: number;
  topLinks: Array<StrapiLink>;
  bottomLinks: Array<StrapiLink>;
  newsletterConditionsText?: BlocksContent;
}
