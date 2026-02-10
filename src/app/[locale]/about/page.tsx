import { BlockRenderer } from "@/components/common/block-renderer";
import { PreFooterMarquee } from "@/components/common/pre-footer-marquee";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { getAboutContent } from "@/services/strapi/aboutService";
import { Suspense } from "react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const about = await getAboutContent(locale);
  if (!about?.blocks?.length) {
    return <p>No about content found</p>;
  }
  return (
    <div>
      <div className="bg-off-white pt-37 pb-0 lg:pt-40">
        {about.blocks.map((block, index) => (
          <Suspense
            key={`${block.__component}-${index}`}
            fallback={<BlockSkeleton />}
          >
            <BlockRenderer block={block} locale={locale} />
          </Suspense>
        ))}
      </div>
      <PreFooterMarquee />
    </div>
  );
}
