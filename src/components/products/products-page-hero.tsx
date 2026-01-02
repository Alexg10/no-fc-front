"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiProductsPageHero } from "@/types/strapi/products-page";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface ProductsPageHeroProps {
  hero: StrapiProductsPageHero;
}

export function ProductsPageHero({ hero }: ProductsPageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-lg container mx-auto px-4">
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
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        {hero.title && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {hero.title}
          </h1>
        )}

        {hero.description && (
          <div className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            {typeof hero.description === "string" ? (
              <p>{hero.description}</p>
            ) : (
              <BlockRendererClient content={hero.description as unknown as BlocksContent} />
            )}
          </div>
        )}

        {hero.btnLink && hero.btnLabel && (
          <Link
            href={hero.btnLink}
            className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            {hero.btnLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
