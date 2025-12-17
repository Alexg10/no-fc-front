import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { StrapiArticleQuote } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface ArticleQuoteBlockProps {
  block: StrapiArticleQuote;
}

export function ArticleQuoteBlock({ block }: ArticleQuoteBlockProps) {
  return (
    <div className="my-12">
      <blockquote className="border-l-4 border-black dark:border-white pl-6 py-4">
        <div className="mb-4">
          <BlockRendererClient content={block.quote as BlocksContent} />
        </div>

        {block.name && (
          <div className="mt-4 space-y-1">
            <p className="font-semibold text-black dark:text-white">
              {block.name}
            </p>
            {block.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {block.description}
              </p>
            )}
          </div>
        )}
      </blockquote>
    </div>
  );
}
