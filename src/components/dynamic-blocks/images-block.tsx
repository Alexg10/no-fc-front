import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleImages } from "@/types/strapi";
import Image from "next/image";

interface ImagesBlockProps {
  block: StrapiArticleImages;
}

export function ImagesBlock({ block }: ImagesBlockProps) {
  const images = block.images || [];

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-12 images-block">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-3/4 w-full max-w-sm overflow-hidden rounded-lg"
            >
              <Image
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || "Article image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
