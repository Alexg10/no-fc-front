import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiArticle } from "@/types/strapi/article";
import Image from "next/image";

export function HeroArticle({ article }: { article: StrapiArticle }) {
  return (
    <div>
      <div className="h-[150vh] relative w-full">
        <Image
          src={getStrapiImageUrl(article?.cover?.url)}
          alt={article?.cover?.alternativeText || ""}
          className="object-cover"
          fill
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-white text-4xl font-bold">{article?.title}</h1>
        </div>
      </div>
    </div>
  );
}
