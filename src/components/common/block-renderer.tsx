import { NewestArticles } from "@/components/common/homepage/newest-articles";
import { ArticleIntroBlock } from "@/components/dynamic-blocks/article-intro-block";
import { ArticleQuoteBlock } from "@/components/dynamic-blocks/article-quote-block";
import { CarouselBlock } from "@/components/dynamic-blocks/carousel-block";
import { CenteredTextBlock } from "@/components/dynamic-blocks/centered-text-block";
import { ColumnsBlock } from "@/components/dynamic-blocks/columns-block";
import { CreditsBlock } from "@/components/dynamic-blocks/credits-block";
import { CustomContainerBlock } from "@/components/dynamic-blocks/custom-container-block";
import { HomeProductsBlock } from "@/components/dynamic-blocks/home-products-block";
import { ImageColsBlock } from "@/components/dynamic-blocks/image-cols-block";
import { ImageStackBlock } from "@/components/dynamic-blocks/image-stack-block";
import { ImagesBlock } from "@/components/dynamic-blocks/images-block";
import { LargeImageBlock } from "@/components/dynamic-blocks/large-image-block";
import { ProductBlock } from "@/components/dynamic-blocks/product-block";
import { SectionPushBlock } from "@/components/dynamic-blocks/section-push-block";
import { Content } from "@/components/dynamic-blocks/simple-page/content";
import { FaqsBlock } from "@/components/dynamic-blocks/simple-page/faqs-block";
import { TitleContentBlock } from "@/components/dynamic-blocks/title-content-block";
import { VideoFullWidthBlock } from "@/components/dynamic-blocks/video-full-width-block";
import { VideoPortraitBlock } from "@/components/dynamic-blocks/video-portrait-block";
import { TextImageBlock } from "@/components/dynamic-blocks/text-image-block";
import type { StrapiBlock } from "@/types/strapi";
import { ColorList, StrapiArticle } from "@/types/strapi/article";

interface BlockRendererProps {
  block: StrapiBlock;
  locale?: string;
  mainColor?: ColorList;
  issueNumber?: string;
  article?: StrapiArticle | null;
}

export async function BlockRenderer({
  block,
  locale,
  issueNumber,
  article,
  mainColor,
}: BlockRendererProps) {
  switch (block.__component) {
    case "common.centered-text":
      return <CenteredTextBlock block={block} />;
    case "common.section-push":
      return <SectionPushBlock block={block} />;
    case "common.video-full-width":
      return <VideoFullWidthBlock block={block} />;
    case "common.video-portrait":
      return <VideoPortraitBlock block={block} />;
    case "common.text-image":
      return <TextImageBlock block={block} />;
    case "homepage.home-products":
      return <HomeProductsBlock block={block} />;
    case "homepage.newest-articles":
      return <NewestArticles block={block} locale={locale} />;
    case "simple-page.content":
      return <Content block={block} />;
    case "simple-page.faqs":
      return <FaqsBlock block={block} />;
    case "article.quote":
      return mainColor ? <ArticleQuoteBlock block={block} mainColor={mainColor} /> : null;
    case "article.description":
      return mainColor && issueNumber ? (
        <ArticleIntroBlock
          article={article}
          block={block}
          mainColor={mainColor}
          issueNumber={issueNumber}
        />
      ) : null;
    case "article.carousel":
      return <CarouselBlock block={block} />;
    case "article.columns-blocks":
      return <ColumnsBlock block={block} />;
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
    case "article.custom-container":
      return <CustomContainerBlock block={block} />;
    case "article.large-image":
      return <LargeImageBlock block={block} />;
    default:
      console.warn(`Unknown block type: ${(block as StrapiBlock).__component}`);
      return null;
  }
}
