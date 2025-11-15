import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { StrapiCenteredText } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface CenteredTextBlockProps {
  block: StrapiCenteredText;
}

export function CenteredTextBlock({ block }: CenteredTextBlockProps) {
  const content = block.content || block.text;
  const isBlocksContent = content && typeof content === "object";

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {isBlocksContent ? (
          <div className="text-left">
            <BlockRendererClient content={content as BlocksContent} />
          </div>
        ) : content ? (
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
            dangerouslySetInnerHTML={{ __html: content as string }}
          />
        ) : null}
      </div>
    </section>
  );
}
