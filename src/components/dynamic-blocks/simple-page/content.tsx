import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { StrapiSimplePageContent } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface ContentProps {
  block: StrapiSimplePageContent;
}

export function Content({ block }: ContentProps) {
  const content = block.content;

  return (
    <div>
      <BlockRendererClient
        content={content as BlocksContent}
        className="text-l-polymath [&>h2]:first:mt-0!"
      />
    </div>
  );
}
