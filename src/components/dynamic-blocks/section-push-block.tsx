"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { ButtonUi } from "@/components/ui/button-ui";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiCommonSectionPush } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SectionPushBlockProps {
  block: StrapiCommonSectionPush;
}

function stripHashForNavigation(href: string): string {
  const i = href.indexOf("#");
  if (i === -1) return href;
  return href.slice(0, i);
}

function SectionPushContent({ block }: SectionPushBlockProps) {
  return (
    <>
      {(block.cover || block.coverMobile) && (
        <div className="relative w-full aspect-3/4 md:aspect-video overflow-hidden">
          {block.coverMobile && (
            <Image
              src={getStrapiImageUrl(block.coverMobile.url)}
              alt={block.coverMobile.alternativeText || "Cover image"}
              fill
              className="object-cover md:hidden"
            />
          )}
          {block.cover && (
            <Image
              src={getStrapiImageUrl(block.cover.url)}
              alt={block.cover.alternativeText || "Cover image"}
              fill
              className={cn(
                "object-cover",
                block.coverMobile ? "hidden md:block" : "",
              )}
            />
          )}
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

function SectionPushLinkedBlock({ block }: SectionPushBlockProps) {
  const router = useRouter();
  const rawHref = block.button?.link ?? "";
  const href = stripHashForNavigation(rawHref);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    try {
      const target = new URL(e.currentTarget.href);
      if (target.origin !== window.location.origin) return;

      e.preventDefault();
      router.push(`${target.pathname}${target.search}`, { scroll: true });
    } catch {
      // mailto:, tel:, URL invalides — laisser le comportement natif
    }
  };

  return (
    <Link href={href} scroll={true} onClick={handleClick}>
      <SectionPushContent block={block} />
    </Link>
  );
}

export function SectionPushBlock({ block }: SectionPushBlockProps) {
  console.log(block);
  return (
    <section
      className={cn(
        "py-4 lg:py-6 lg:px-2 pb-20 lg:pb-20",
        block.whiteText ? "text-white" : "text-black dark:text-white",
      )}
    >
      <Grid>
        <div className="relative col-span-full group">
          {block.button?.link ? (
            <SectionPushLinkedBlock block={block} />
          ) : (
            <SectionPushContent block={block} />
          )}
        </div>
      </Grid>
    </section>
  );
}
