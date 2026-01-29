import { ArticleCardBadge } from "@/components/articles/article-card-badge";
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import Image from "next/image";
interface ArticleCardProps {
  article: StrapiArticle;
  issueLabel: string;
  locale?: string;
}

export function ArticleCard({ article, issueLabel, locale }: ArticleCardProps) {
  const articleHref = `${locale ? `/${locale}` : ""}/articles/${article.slug}`;

  return (
    <Link href={articleHref} className="group flex flex-col gap-4">
      <div className="relative aspect-7/8 w-full overflow-hidden">
        {article.cover?.url && (
          <div className="relative aspect-7/8 ">
            <Image
              src={getStrapiImageUrl(article.cover.url)}
              alt={article.cover.alternativeText || article.title}
              fill
              className="object-cover group-hover:scale-110 transition-all duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <div
              className="absolute inset-0 w-full h-full bg-center bg-no-repeat mix-blend-screen"
              style={{
                backgroundImage: `url("/images/article/carousel_texture_image.png")`,
                backgroundSize: "calc(100% + 1px) calc(100% + 1px)",
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
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="heading-s-obviously">{article.title}</h3>
        {article.shortDescription && (
          <div className="line-clamp-2">
            <BlockRendererClient
              content={article.shortDescription}
              className="text-l-polymath text-black [&>p]:mb-0 [&>*>strong]:font-normal"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
