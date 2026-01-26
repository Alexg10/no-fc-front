import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiArticleImageStack, StrapiImage } from "@/types/strapi";
import Image from "next/image";

interface ImageStackBlockProps {
  block: StrapiArticleImageStack;
}

export function ImageStackBlock({ block }: ImageStackBlockProps) {
  const images = block.images || [];
  return (
    <section className="py-10 flex overflow-hidden">
      <div className="flex w-full px-4 max-w-[1424px] mx-auto lg:grid lg:grid-cols-12 lg:gap-6">
        <div className={cn("col-span-full",
          images.length === 2 ? "flex gap-4 lg:col-start-2 lg:col-end-12" : "flex flex-wrap lg:col-span-full lg:justify-between"
        )}>
          {images.length > 0 && (
            images.map((image: StrapiImage) => {
            return (
              <div key={image.id} className={cn("relative ",
                images.length === 2 ? "first:-rotate-6 last:rotate-[4deg] first:translate-x-[5px] last:translate-x-[-10px] last:translate-y-[30px]" : "max-w-1/2 lg:max-w-[474px] first:-rotate-6 nth-2:lg:translate-y-[190px] nth-2:lg:translate-y-[90px] nth-2:z-10 nth-2:lg:translate-x-[-90px] last:lg:rotate-[-4deg] last:lg:rotate-[4deg] nth-2:lg:rotate-[-6deg] nth-2:rotate-[7deg] nth-3:rotate-[4deg] nth-3:lg:translate-x-[250px] nth-3:lg:translate-y-[-330px] first:translate-x-[5px] last:translate-x-[-10px] last:translate-y-[-20px]  last:lg:translate-y-[30px] last:z-10 last:lg:translate-y-[-300px]"

              )}>
                <div className="absolute inset-0 w-full h-full bg-center bg-no-repeat mix-blend-screen"
                  style={{
                    backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                    backgroundSize: "100% 100%",
                  }}
                />
                <Image
                  src={getStrapiImageUrl(image.url)}
                  alt={image.alternativeText || ""}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="w-full h-auto "
                />
              </div>
            );
          }))}
        </div>
      </div>
    </section>
  );
}
