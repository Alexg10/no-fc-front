"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { ButtonLink } from "@/components/ui/button-link";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { StrapiProductsPageHero } from "@/types/strapi/products-page";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface ProductsPageHeroProps {
  hero: StrapiProductsPageHero;
}

export function ProductsPageHero({ hero }: ProductsPageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-video">
        {hero.cover && (
          <Image
            src={getStrapiImageUrl(hero.cover.url)}
            alt={hero.cover.alternativeText || hero.title || "Products hero"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div
        className={cn(
          "absolute left-0 right-0 px-6 flex flex-col justify-start items-start",
          hero.btnLink
            ? "bottom-10 md:bottom-16 space-y-6"
            : "bottom-0 p-6 gap-6",
        )}
      >
        {hero.title && <h2 className="heading-m-obviously">{hero.title}</h2>}

        {hero.description && (
          <BlockRendererClient
            content={hero.description as unknown as BlocksContent}
            className="text-polymath text-[16px] [&>p]:text-[16px]! [&>p]:mb-0!"
          />
        )}

        {hero.btnLabel && hero.btnLink && (
          <ButtonLink href={hero.btnLink}>{hero.btnLabel}</ButtonLink>
        )}
      </div>
    </section>
  );
}
