"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid/grid";
import { ArticleQuoteBlock } from "@/components/dynamic-blocks/article-quote-block";
import { Title } from "@/components/ui/title";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getColorClass } from "@/lib/utils";
import type { StrapiArticleCustomContainer } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { VideoFullWidthBlock } from "./video-full-width-block";

interface CustomContainerBlockProps {
  block: StrapiArticleCustomContainer;
}

export function CustomContainerBlock({ block }: CustomContainerBlockProps) {
  const textColor = block.whiteText ? "text-white" : "text-black";
  const bgColor = getColorClass(block.backgroundColor, "bg");

  return (
    <section
      className={`[&+&]:pt-0 relative w-full full-width py-9 lg:py-46 lg:pb-20 ${bgColor} ${textColor}`}
    >
      {block.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${getStrapiImageUrl(
              block.backgroundImage.url,
            )})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        />
      )}
      <Grid className="relative">
        <div className="col-span-full lg:col-start-3 lg:col-end-11 flex flex-col gap-17 mb-5">
          {block.title && <Title className="mb-2">{block.title}</Title>}
        </div>

        {block.content && (
          <div className="col-span-full md:col-start-2 md:col-end-6 lg:col-start-4 lg:col-end-10 flex flex-col gap-17">
            <div className="text-l-polymath">
              <BlockRendererClient content={block.content as BlocksContent} />
            </div>
          </div>
        )}

        {block.image && (
          <div className="col-span-full lg:col-start-3 lg:col-end-11 flex flex-col gap-17">
            <figure className="relative max-w-[280px] lg:max-w-full mx-auto">
              <div className="absolute -top-14 -right-14">
                <Image
                  src={"/images/article/image_scotch.png"}
                  alt={block.image.alternativeText || "Custom container image"}
                  width={319}
                  height={186}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <Image
                src={getStrapiImageUrl(block.image.url)}
                alt={block.image.alternativeText || "Custom container image"}
                width={block.image.width || 1200}
                height={block.image.height || 600}
              />
            </figure>
          </div>
        )}
        {block.quote && (
          <div className="col-span-full lg:col-start-3 lg:col-end-11">
            <ArticleQuoteBlock block={block.quote} mainColor={"pink"} />
          </div>
        )}
        {block.video && (
          <div className="col-span-full lg:col-start-1 lg:col-end-12">
            <VideoFullWidthBlock block={block.video} />
          </div>
        )}
      </Grid>
    </section>
  );
}
