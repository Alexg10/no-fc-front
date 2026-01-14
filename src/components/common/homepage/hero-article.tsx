import { getStrapiImageUrl } from "@/lib/strapi";
import { getLastArticle } from "@/services/strapi/articleService";
import { StrapiArticle } from "@/types/strapi/article";
import Image from "next/image";

async function HeroArticle({ article }: { article?: StrapiArticle | null }) {
  let displayArticle = article;

  if (!displayArticle) {
    displayArticle = await getLastArticle();
  }

  if (!displayArticle) {
    return null;
  }

  return (
    <div>
      <div className="h-[150vh] relative w-full">
        <Image
          src={getStrapiImageUrl(displayArticle.cover?.url)}
          alt={displayArticle.cover?.alternativeText || ""}
          className="object-cover"
          fill
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-white text-4xl font-bold">
            {displayArticle.title}
          </h1>
        </div>
      </div>
    </div>
  );
}

export { HeroArticle };
