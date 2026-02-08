import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { StrapiBlock } from "@/types/strapi";
import { Suspense } from "react";

interface HomeBlocksProps {
  blocks: StrapiBlock[];
  locale?: string;
}

export function HomeBlocks({ blocks, locale }: HomeBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Block spacing is managed at the block level (e.g., SectionPushBlock has py-4 lg:py-6)
  return (
    <div className="space-y-20">
      {blocks.map((block, index) => (
        <Suspense key={block.id || index} fallback={<BlockSkeleton />}>
          <BlockRenderer block={block} locale={locale} />
        </Suspense>
      ))}
    </div>
  );
}
