"use client";

import { ArticleCardBadge } from "@/components/articles/article-card-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface ArticleCardProps {
  article: StrapiArticle;
  issueLabel: string;
  locale?: string;
}

export function ArticleCard({ article, issueLabel, locale }: ArticleCardProps) {
  const t = useTranslations("common");
  const articleHref = `/articles/${article.slug}`;

  const [hoverActive, setHoverActive] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const onImagePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const offsetX = 14;
      const offsetY = 4;
      setCursor({
        x: e.clientX + offsetX,
        y: e.clientY - offsetY,
      });
    },
    [],
  );

  return (
    <Link href={articleHref} className="group flex flex-col gap-4">
      <div
        className="relative aspect-7/8 w-full overflow-hidden"
        onMouseEnter={() => setHoverActive(true)}
        onMouseLeave={() => setHoverActive(false)}
        onMouseMove={onImagePointerMove}
      >
        {article.cover?.url && (
          <div className="relative aspect-7/8 overflow-hidden">
            <Image
              src={getStrapiImageUrl(article.cover.url)}
              alt={article.cover.alternativeText || article.title}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <div
              className="absolute -top-px -left-px w-[calc(100%+2px)] h-[calc(100%+2px)] bg-center bg-no-repeat mix-blend-screen"
              style={{
                backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                backgroundSize: "100% 100%",
              }}
            />
          </div>
        )}
        {article.issueNumber && (
          <div className="absolute top-3 left-3 lg:top-5 lg:left-5">
            <ArticleCardBadge
              issueNumber={article.issueNumber}
              issueLabel={issueLabel}
            />
          </div>
        )}

        {hoverActive &&
          createPortal(
            <div
              className="pointer-events-none fixed z-100 bg-white p-2 hidden md:block"
              style={{ left: cursor.x, top: cursor.y }}
              aria-hidden
            >
              <div className="flex items-center justify-center border border-black px-4 py-[6px]">
                <span className="text-center text-nowrap text-obviously uppercase tracking-wide text-black text-[13px] leading-none md:text-[15px]">
                  {t("readArticle")}
                </span>
              </div>
            </div>,
            document.body,
          )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="heading-s-obviously">{article.title}</h3>
        {article.shortDescription && (
          <div className="line-clamp-2 text-ellipsis overflow-hidden">
            <BlockRendererClient
              content={article.shortDescription}
              className="text-l-polymath text-black [&>p]:mb-0 [&>*>strong]:font-normal "
            />
          </div>
        )}
      </div>
    </Link>
  );
}
