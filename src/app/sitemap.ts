import { getCollections, getProducts } from "@/lib/shopify";
import { getArticlesPaginated } from "@/services/strapi/articleService";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Récupérer toutes les collections
  let collectionsPages: MetadataRoute.Sitemap = [];
  try {
    const collectionsData = await getCollections(250);
    collectionsPages = collectionsData.edges.map((edge) => ({
      url: `${siteUrl}/collections/${edge.node.handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching collections for sitemap:", error);
  }

  // Récupérer tous les produits (en plusieurs requêtes si nécessaire)
  let productsPages: MetadataRoute.Sitemap = [];
  try {
    let hasNextPage = true;
    let cursor: string | undefined = undefined;
    const allProducts: string[] = [];

    // Récupérer tous les produits par lots de 250
    let maxIterations = 10; // Limiter à 10 itérations pour éviter les boucles infinies
    while (hasNextPage && maxIterations > 0) {
      const productsData = await getProducts({
        first: 250,
        after: cursor,
      });

      allProducts.push(
        ...productsData.edges.map((edge) => edge.node.handle)
      );

      hasNextPage = productsData.pageInfo.hasNextPage;
      cursor = productsData.pageInfo.endCursor || undefined;
      maxIterations--;
    }

    productsPages = allProducts.map((handle) => ({
      url: `${siteUrl}/products/${handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Récupérer tous les articles Strapi (paginés)
  let articlesPages: MetadataRoute.Sitemap = [];
  try {
    const allSlugs: string[] = [];
    let page = 1;
    let pageCount = 1;

    while (page <= pageCount) {
      const result = await getArticlesPaginated("fr", page);
      for (const article of result.articles) {
        if (article.slug) allSlugs.push(article.slug);
      }
      pageCount = result.pageCount;
      page++;
    }

    articlesPages = allSlugs.map((slug) => ({
      url: `${siteUrl}/articles/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  return [
    ...staticPages,
    ...collectionsPages,
    ...productsPages,
    ...articlesPages,
  ];
}

