import { NewestArticles } from "@/components/common/homepage/newest-articles";
import { ArticleIntroBlock } from "@/components/dynamic-blocks/article-intro-block";
import { ArticleQuoteBlock } from "@/components/dynamic-blocks/article-quote-block";
import { CarouselBlock } from "@/components/dynamic-blocks/carousel-block";
import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
import { CreditsBlock } from "@/components/dynamic-blocks/credits-block";
import { HomeProductsBlock } from "@/components/dynamic-blocks/home-products-block";
import { ImageColsBlock } from "@/components/dynamic-blocks/image-cols-block";
import { ImageStackBlock } from "@/components/dynamic-blocks/image-stack-block";
import { ImagesBlock } from "@/components/dynamic-blocks/images-block";
import { ProductBlock } from "@/components/dynamic-blocks/product-block";
import { Content } from "@/components/dynamic-blocks/simple-page/content";
import { FaqsBlock } from "@/components/dynamic-blocks/simple-page/faqs-block";
import { TitleContentBlock } from "@/components/dynamic-blocks/title-content-block";
import { VideoFullWidthBlock } from "@/components/dynamic-blocks/video-full-width-block";
import type { StrapiBlock } from "@/types/strapi";
import { ColorList } from "@/types/strapi/article";

interface BlockRendererProps {
  block: StrapiBlock;
  locale?: string;
  mainColor: ColorList;
}

export async function BlockRenderer({
  block,
  locale,
  mainColor,
}: BlockRendererProps) {
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
      return <ArticleQuoteBlock block={block} mainColor={mainColor} />;
    case "article.description":
      return <ArticleIntroBlock block={block} mainColor={mainColor} />;
    case "article.carousel":
      return <CarouselBlock block={block} />;
    case "article.title-content":
      return <TitleContentBlock block={block} />;
    case "article.images":
      return <ImagesBlock block={block} />;
    case "article.image-cols":
      return <ImageColsBlock block={block} />;
    case "article.image-stack":
      return <ImageStackBlock block={block} />;
    case "article.product":
      return <ProductBlock block={block} locale={locale} />;
    case "article.credits":
      return <CreditsBlock block={block} />;
    default:
      console.warn(`Unknown block type: ${(block as StrapiBlock).__component}`);
      return null;
  }
}
