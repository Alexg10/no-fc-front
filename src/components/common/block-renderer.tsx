import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
import type { StrapiBlock } from "@/types/strapi";

interface BlockRendererProps {
  block: StrapiBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.__component) {
    case "common.centered-text":
      return <CenteredTextBlock block={block} />;
    default:
      console.warn(`Unknown block type: ${block.__component}`);
      return null;
  }
}
