import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { QuoteIcon } from "@/components/icons/quote-icon";
import { cn, getColorClass } from "@/lib/utils";
import type { StrapiArticleQuote } from "@/types/strapi";
import { ColorList } from "@/types/strapi/article";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface ArticleQuoteBlockProps {
  block: StrapiArticleQuote;
  mainColor: ColorList;
}

export function ArticleQuoteBlock({
  block,
  mainColor,
}: ArticleQuoteBlockProps) {
  return (
    <div className="mt-12 pb-15 ">
      <Grid>
        <div className="col-span-full lg:col-start-4 lg:col-end-10">
          <blockquote className="text-xl-polymath">
            <div className={cn("absolute", getColorClass(mainColor, "text"))}>
              <QuoteIcon />
            </div>
            <div className="mb-4">
              <BlockRendererClient
                content={block.quote as BlocksContent}
                className="text-xl-polymath-display [&>p]:text-xl-polymath [&>p]:text-[24px] [&>p]:lg:text-[32px] [&>p]:leading-[120%] quote-indent"
              />
            </div>

            {block.name && (
              <div className="mt-8 flex gap-1">
                <p className="text-polymath-display text-[16px] lg:text-[18px]">
                  {block.name}
                </p>
                {block.description && (
                  <p className="text-polymath text-[16px] lg:text-[18px]">
                    {block.description}
                  </p>
                )}
              </div>
            )}
          </blockquote>
        </div>
      </Grid>
    </div>
  );
}
