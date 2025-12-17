import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
import { Content } from "@/components/dynamic-blocks/content";
import { HomeProductsBlock } from "@/components/dynamic-blocks/home-products-block";
import type { StrapiBlock } from "@/types/strapi";

interface BlockRendererProps {
  block: StrapiBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.__component) {
    case "common.centered-text":
      return <CenteredTextBlock block={block} />;
    case "homepage.home-products":
      return <HomeProductsBlock block={block} />;
    case "simple-page.content":
      return <Content block={block} />;
    default:
      console.warn(`Unknown block type: ${(block as StrapiBlock).__component}`);
      return null;
  }
}
