import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { StrapiArticleDescription } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface ArticleDescriptionBlockProps {
  block: StrapiArticleDescription;
}

export function ArticleDescriptionBlock({
  block,
}: ArticleDescriptionBlockProps) {
  return (
    <div className="my-8">
      <BlockRendererClient content={block.description as BlocksContent} />
    </div>
  );
}
