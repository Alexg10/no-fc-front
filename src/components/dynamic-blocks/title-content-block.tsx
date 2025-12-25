import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleTitleContent } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface TitleContentBlockProps {
  block: StrapiArticleTitleContent;
}

export function TitleContentBlock({ block }: TitleContentBlockProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      {block.title && (
        <h2 className="text-3xl font-bold mb-8">{block.title}</h2>
      )}

      <div className={block.twoColumns ? "text-2-cols" : ""}>
        {block.content && (
          <div>
            <BlockRendererClient content={block.content as BlocksContent} />
          </div>
        )}
      </div>
      {block.image && (
        <div>
          <Image
            src={getStrapiImageUrl(block.image?.url)}
            alt={block.title || "Block image"}
            width={block.image?.width || 1200}
            height={block.image?.height || 600}
            sizes={
              block.twoColumns
                ? "(max-width: 640px) 100vw, 50vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 100vw"
            }
            className="w-full h-auto"
            loading="lazy"
            quality={90}
          />
        </div>
      )}
    </section>
  );
}
