import { getStrapiImageUrl } from "@/lib/strapi";
import { getArticleBySlug } from "@/services/strapi/articleService";
import Image from "next/image";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  console.log("article:", article);
  console.log("article cover:", article?.cover);
  return (
    <div>
      {article?.title}
      <Image
        src={getStrapiImageUrl(article?.cover?.url)}
        alt={article?.cover?.alternativeText || ""}
        width={article?.cover?.width}
        height={article?.cover?.height}
        unoptimized
      />
    </div>
  );
}
