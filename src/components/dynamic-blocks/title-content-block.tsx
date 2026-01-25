import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { ImageCaption } from "@/components/ui/image-caption";
import { Title } from "@/components/ui/title";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleTitleContent } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface TitleContentBlockProps {
  block: StrapiArticleTitleContent;
}

export function TitleContentBlock({ block }: TitleContentBlockProps) {

  return (
    <section className="py-20 pb-16">
      <Grid>
        {block.title && (
          <div className="col-span-full lg:col-start-3 lg:col-end-11 flex flex-col gap-10">
            <Title>{block.title}</Title>
          </div>
        )}
        <div className={cn("col-span-full  flex flex-col gap-20", block.twoColumns ? "lg:col-start-2 lg:col-end-12" : "lg:col-start-4 lg:col-end-10")}>
          <div className={block.twoColumns ? "md:text-2-cols" : ""}>
            {block.content && (
              <div>
                <BlockRendererClient content={block.content as BlocksContent} className="text-l-polymath" />
              </div>
            )}
          </div>
          {block.image && (
            <figure className="max-w-[476px] mx-auto">
              <Image
                src={getStrapiImageUrl(block.image?.url)}
                alt={block.title || "Block image"}
                width={block.image?.width || 1200}
                height={block.image?.height || 600}
                sizes={
                  block.twoColumns
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 100vw"
                }
                className="w-full h-auto"
                loading="lazy"
                quality={90}
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
