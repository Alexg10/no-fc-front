import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid/grid";
import { ImageCaption } from "@/components/ui/image-caption";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleImageCols } from "@/types/strapi";
import Image from "next/image";
interface ImageColsBlockProps {
  block: StrapiArticleImageCols;
}

export function ImageColsBlock({ block }: ImageColsBlockProps) {
  return (
    <section className="pb-19">
      <Grid>
        <div
          className={cn(
            "col-span-full flex flex-col gap-12 lg:col-start-2 lg:col-end-12 lg:grid lg:grid-cols-10 lg:gap-6",
            block.imageRight ? "lg:grid-flow-dense" : "",
          )}
        >
          <div
            className={cn(
              "space-y-6",
              block.imageRight
                ? "lg:col-start-1 lg:col-end-7"
                : "lg:col-start-5 lg:col-end-11",
            )}
          >
            {block.content && (
              <BlockRendererClient
                content={block.content}
                className="[&>h3]:first:mt-0"
              />
            )}
          </div>
          {block.image && (
            <figure
              className={cn(
                "flex justify-start flex-col ",
                block.imageRight
                  ? "lg:col-start-8 lg:col-end-11 max-w-[280px] lg:max-w-[476px] mx-auto"
                  : "lg:col-start-1 lg:col-end-4 row-span-full max-w-[280px] lg:max-w-[476px] mx-auto",
              )}
            >
              <Image
                src={getStrapiImageUrl(block.image.url)}
                alt={block.image.alternativeText || ""}
                width={block.image.width || 500}
                height={block.image.height || 500}
                className="w-full h-auto"
              />
              {block.image.caption && (
                <ImageCaption caption={block.image.caption} />
              )}
            </figure>
          )}
        </div>
      </Grid>
    </section>
  );
}
