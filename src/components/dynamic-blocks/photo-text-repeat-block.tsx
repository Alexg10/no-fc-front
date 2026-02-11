import Grid from "@/components/common/grid/grid";
import { Title } from "@/components/ui/title";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn, getColorClass, getRepeatShadow } from "@/lib/utils";
import type { StrapiCommonPhotoTextRepeat } from "@/types/strapi";
import Image from "next/image";

interface PhotoTextRepeatBlockProps {
  block: StrapiCommonPhotoTextRepeat;
}

const imagePositionStyles = [
  "-rotate-7 z-10 lg:translate-x-[-10px] lg:translate-y-[-85px] lg:-rotate-5",
  "rotate-10 translate-x-[20px] translate-y-[-20px] lg:translate-x-[105px] lg:translate-y-[-135px] lg:rotate-14",
  "rotate-10 translate-x-[-10px] translate-y-[-10px] lg:translate-x-[-115px] lg:translate-y-[-225px] lg:rotate-8",
  "-rotate-8 translate-x-[20px] translate-y-[-20px] lg:translate-x-[85px] lg:translate-y-[-135px] lg:-rotate-6",
];

export function PhotoTextRepeatBlock({ block }: PhotoTextRepeatBlockProps) {
  const bgColor = getColorClass(block.backgroundColor, "bg");
  const textColor = getColorClass(block.textColor);
  const hasMultipleImages = block.images && block.images.length > 1;

  return (
    <section className={`py-28 overflow-hidden lg:pb-0 ${bgColor}`}>
      <Grid>
        <div className="col-span-full lg:col-start-3 lg:col-end-11">
          <Title
            className={`text-[48px] lg:text-[120px] ${textColor}`}
            style={{ textShadow: getRepeatShadow(block.textColor) }}
          >
            {block.text}
          </Title>
          <div className="flex flex-wrap md:max-w-1/2 mx-auto lg:max-w-full">
            {block.images?.map((image, index) => (
              <Image
                key={image.id}
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || ""}
                width={image.width || 1200}
                height={image.height || 600}
                className={cn(
                  "w-full h-full object-cover",
                  !hasMultipleImages && "-rotate-7",
                  hasMultipleImages && "w-1/2 max-w-[160px] lg:max-w-[442px]",
                  hasMultipleImages && imagePositionStyles[index],
                )}
              />
            ))}
          </div>
        </div>
      </Grid>
    </section>
  );
}
