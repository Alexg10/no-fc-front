import Grid from "@/components/common/grid/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleLargeImage } from "@/types/strapi";
import Image from "next/image";

interface LargeImageBlockProps {
  block: StrapiArticleLargeImage;
}

export function LargeImageBlock({ block }: LargeImageBlockProps) {
  if (!block.image?.url) {
    return null;
  }

  const imageUrl = getStrapiImageUrl(block.image.url);
  const size = block.size;

  return (
    <section className="pb-12 md:pb-16 lg:pb-20">
      <Grid>
        <div
          className={cn(
            "col-span-full ",
            size === "small"
              ? "lg:col-span-4 lg:col-start-5 lg:col-end-9"
              : size === "medium"
                ? "lg:col-start-3 lg:col-end-11"
                : "lg:col-span-12",
          )}
        >
          <Image
            src={imageUrl}
            alt={block.image.alternativeText || "Large image"}
            width={block.image.width || 1200}
            height={block.image.height || 600}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            priority={false}
            loading="lazy"
          />
        </div>
      </Grid>
    </section>
  );
}
