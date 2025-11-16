import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
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
    default:
      console.warn(`Unknown block type: ${block.__component}`);
      return null;
  }
}
