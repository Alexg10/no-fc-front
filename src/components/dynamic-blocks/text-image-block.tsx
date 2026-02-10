"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { ButtonLink } from "@/components/ui/button-link";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiCommonTextImage } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface TextImageBlockProps {
  block: StrapiCommonTextImage;
}

export function TextImageBlock({ block }: TextImageBlockProps) {
  return (
    <section className="py-12 lg:py-16 lg:pb-30">
      <Grid>
        <div className="col-span-full h-full flex flex-col lg:flex-row justify-center gap-6 lg:items-end lg:grid lg:grid-cols-12">
          {block.imageLeft && block.image && (
            <div className="relative lg:h-full lg:col-span-6">
              <Image
                src={getStrapiImageUrl(block.image.url)}
                alt={block.image.alternativeText || block.title || ""}
                width={block.image.width || 1200}
                height={block.image.height || 600}
                className="object-cover"
              />
            </div>
          )}
          <div
            className={`flex flex-col justify-center space-y-6 ${
              block.imageLeft
                ? "lg:col-start-8 lg:col-end-13"
                : "lg:col-start-1 lg:col-end-7"
            }`}
          >
            {block.title && (
              <h2 className="heading-m-obviously text-left">{block.title}</h2>
            )}

            {block.content && (
              <BlockRendererClient
                content={block.content as BlocksContent}
                className="text-polymath"
              />
            )}

            {block.link && block.labelLink && (
              <ButtonLink href={block.link}>{block.labelLink}</ButtonLink>
            )}
          </div>
          {!block.imageLeft && block.image && (
            <div className="relative lg:h-full lg:col-start-8 lg:col-end-13">
              <Image
                src={getStrapiImageUrl(block.image.url)}
                alt={block.image.alternativeText || block.title || ""}
                width={block.image.width || 1200}
                height={block.image.height || 600}
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Grid>
    </section>
  );
}
