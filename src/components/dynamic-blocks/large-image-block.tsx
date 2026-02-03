import Grid from "@/components/common/grid/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
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

  return (
    <section className="pb-12 md:pb-16 lg:pb-20">
      <Grid>
        <div className="col-span-full lg:col-start-3 lg:col-end-11">
          <div className="relative w-full h-auto flex justify-center">
            <Image
              src={imageUrl}
              alt={block.image.alternativeText || "Large image"}
              width={block.image.width || 1200}
              height={block.image.height || 600}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority={false}
            />
          </div>
        </div>
      </Grid>
    </section>
  );
}
