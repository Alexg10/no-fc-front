"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid/grid";
import { Title } from "@/components/ui/title";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleCustomContainer } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface CustomContainerBlockProps {
  block: StrapiArticleCustomContainer;
}

const bgColorMap: Record<string, string> = {
  white: "bg-white",
  black: "bg-black",
  pink: "bg-pink",
  lime: "bg-lime",
  blue: "bg-blue",
  grey: "bg-grey",
};

export function CustomContainerBlock({ block }: CustomContainerBlockProps) {
  const textColor = block.whiteText ? "text-white" : "text-black";
  const bgColor = block.backgroundColor
    ? bgColorMap[block.backgroundColor]
    : "";

  return (
    <section
      className={`relative w-full full-width py-9 lg:py-46 lg:pb-20 ${bgColor} ${textColor}`}
    >
      {block.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${getStrapiImageUrl(block.backgroundImage.url)})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        />
      )}
      <Grid className="gap-y-10 lg:gap-y-15 relative">
        <div className="col-span-full lg:col-start-3 lg:col-end-11 flex flex-col gap-17">
          {block.title && <Title className="mb-2">{block.title}</Title>}
        </div>

        <div className="col-span-full md:col-start-2 md:col-end-6 lg:col-start-4 lg:col-end-10 flex flex-col gap-17">
          {block.content && (
            <div className="text-l-polymath">
              <BlockRendererClient content={block.content as BlocksContent} />
            </div>
          )}
        </div>

        <div className="col-span-full lg:col-start-3 lg:col-end-11 flex flex-col gap-17">
          {block.image && (
            <figure className="relative max-w-[280px] lg:max-w-full mx-auto">
              <div className="absolute -top-14 -right-14">
                <Image
                  src={"/images/article/image_scotch.png"}
                  alt={block.image.alternativeText || "Custom container image"}
                  width={319}
                  height={186}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Image
                src={getStrapiImageUrl(block.image.url)}
                alt={block.image.alternativeText || "Custom container image"}
                width={block.image.width || 1200}
                height={block.image.height || 600}
              />
            </figure>
          )}
        </div>
      </Grid>
    </section>
  );
}
