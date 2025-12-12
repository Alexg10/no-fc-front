import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import Image from "next/image";

export function HeroArticle({ article }: { article: StrapiArticle }) {
  return (
    <div>
      <h1>{article?.title}</h1>
      <Image
        src={getStrapiImageUrl(article?.cover?.url)}
        alt={article?.cover?.alternativeText || ""}
        width={article?.cover?.width}
        height={article?.cover?.height}
      />
    </div>
  );
}
