import { BlockRenderer } from "@/components/common/block-renderer";
import { StrapiBlock } from "@/types/strapi";

export function HomeBlocks({ blocks }: { blocks: StrapiBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => (
        <BlockRenderer key={block.id || index} block={block} />
      ))}
    </div>
  );
}
