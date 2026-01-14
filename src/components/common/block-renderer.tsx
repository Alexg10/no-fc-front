import { NewestArticles } from "@/components/common/homepage/newest-articles";
import { ArticleDescriptionBlock } from "@/components/dynamic-blocks/article-description-block";
import { ArticleQuoteBlock } from "@/components/dynamic-blocks/article-quote-block";
import { CarouselBlock } from "@/components/dynamic-blocks/carousel-block";
import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
import { HomeProductsBlock } from "@/components/dynamic-blocks/home-products-block";
import { ImagesBlock } from "@/components/dynamic-blocks/images-block";
import { ProductBlock } from "@/components/dynamic-blocks/product-block";
import { Content } from "@/components/dynamic-blocks/simple-page/content";
import { FaqsBlock } from "@/components/dynamic-blocks/simple-page/faqs-block";
import { TitleContentBlock } from "@/components/dynamic-blocks/title-content-block";
import { VideoFullWidthBlock } from "@/components/dynamic-blocks/video-full-width-block";
import type { StrapiBlock } from "@/types/strapi";

interface BlockRendererProps {
  block: StrapiBlock;
  locale?: string;
}

export async function BlockRenderer({ block, locale }: BlockRendererProps) {
  switch (block.__component) {
    case "common.centered-text":
      return <CenteredTextBlock block={block} />;
    case "common.video-full-width":
      return <VideoFullWidthBlock block={block} />;
    case "homepage.home-products":
      return <HomeProductsBlock block={block} />;
    case "homepage.newest-articles":
      return <NewestArticles block={block} locale={locale} />;
    case "simple-page.content":
      return <Content block={block} />;
    case "simple-page.faqs":
      return <FaqsBlock block={block} />;
    case "article.quote":
      return <ArticleQuoteBlock block={block} />;
    case "article.description":
      return <ArticleDescriptionBlock block={block} />;
    case "article.carousel":
      return <CarouselBlock block={block} />;
    case "article.title-content":
      return <TitleContentBlock block={block} />;
    case "article.images":
      return <ImagesBlock block={block} />;
    case "article.product":
      return <ProductBlock block={block} locale={locale} />;
    default:
      console.warn(`Unknown block type: ${(block as StrapiBlock).__component}`);
      return null;
  }
}
