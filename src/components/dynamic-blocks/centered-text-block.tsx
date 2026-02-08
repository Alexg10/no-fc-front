import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import type { StrapiCenteredText } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { ButtonLink } from "../ui/button-link";

interface CenteredTextBlockProps {
  block: StrapiCenteredText;
}

export function CenteredTextBlock({ block }: CenteredTextBlockProps) {
  const content = block.content || block.text;
  const title = block.title;
  const isBlocksContent = content && typeof content === "object";
  const button = block.button;

  return (
    <section>
      <Grid>
        <div className="col-span-full">
          {title && (
            <BlockRendererClient
              content={title}
              className="heading-m-obviously! [&>p]:heading-m-obviously! [&>h2]:heading-m-obviously!  [&>h3]:heading-m-obviously! [&>h4]:heading-m-obviously! [&>h5]:heading-m-obviously! [&>h6]:heading-m-obviously! text-center"
            />
          )}
        </div>
        <div className="col-span-full lg:col-start-5 lg:col-end-9">
          {isBlocksContent ? (
            <div className="text-center">
              <BlockRendererClient content={content as BlocksContent} />
            </div>
          ) : content ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
              dangerouslySetInnerHTML={{ __html: content as string }}
            />
          ) : null}
        </div>
        {button && button.link && (
          <div className="col-span-full text-center flex justify-center items-center">
            <ButtonLink href={button.link}>{button.label}</ButtonLink>
          </div>
        )}
      </Grid>
    </section>
  );
}
