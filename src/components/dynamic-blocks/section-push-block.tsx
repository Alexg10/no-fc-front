"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { ButtonUi } from "@/components/ui/button-ui";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiCommonSectionPush } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import Link from "next/link";

interface SectionPushBlockProps {
  block: StrapiCommonSectionPush;
}

function SectionPushContent({ block }: SectionPushBlockProps) {
  return (
    <>
      {block.cover && (
        <div className="relative w-full aspect-3/4 md:aspect-video overflow-hidden">
          <Image
            src={getStrapiImageUrl(block.cover.url)}
            alt={block.cover.alternativeText || "Cover image"}
            fill
            className={cn(
              "object-cover",
              block.button?.link &&
                "group-hover:scale-105 transition-all duration-300",
            )}
          />
        </div>
      )}

      <div
        className={cn(
          "absolute left-0 right-0 px-6 flex flex-col justify-center items-center",
          block.button?.link
            ? "bottom-10 md:bottom-16 space-y-6"
            : "bottom-0 p-6 gap-6",
        )}
      >
        {block.title && (
          <h2 className="heading-m-obviously text-center">{block.title}</h2>
        )}

        {block.description && (
          <BlockRendererClient
            content={block.description as BlocksContent}
            className="text-polymath text-[16px] [&>p]:text-[16px]! text-center [&>p]:mb-0!"
          />
        )}

        {block.button && (
          <ButtonUi variant={block.whiteText ? "secondary" : "default"}>
            {block.button.label}
          </ButtonUi>
        )}
      </div>
    </>
  );
}

export function SectionPushBlock({ block }: SectionPushBlockProps) {
  return (
    <section
      className={cn(
        "py-4 lg:py-6 lg:px-2",
        block.whiteText ? "text-white" : "text-black dark:text-white",
      )}
    >
      <Grid>
        <div className="relative col-span-full group">
          {block.button?.link ? (
            <Link href={block.button.link}>
              <SectionPushContent block={block} />
            </Link>
          ) : (
            <SectionPushContent block={block} />
          )}
        </div>
      </Grid>
    </section>
  );
}
