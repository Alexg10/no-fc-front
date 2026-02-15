"use client";

import { ShopifyProduct } from "@/lib/shopify";
import Image from "next/image";
import { Title } from "../ui/title";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { VariantSelector } from "@/components/products/variant-selector";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ProductDescription } from "./product-description";
import { ShippingInfo } from "./shipping-info";

gsap.registerPlugin(ScrollTrigger, useGSAP);
interface ProductContentProps {
  product: ShopifyProduct;
}
export function ProductContent({ product }: ProductContentProps) {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const pinTrigger = useRef<HTMLDivElement>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const imagesColRef = useRef<HTMLDivElement>(null);
  const isUnderDesktop = useBreakpoints().isUnderDesktop;

  useGSAP(
    () => {
      if (isUnderDesktop) return;
      if (!productInfoRef.current || !imagesColRef.current) return;

      const paddingTop = parseFloat(
        getComputedStyle(productInfoRef.current).paddingTop,
      );
      const endOffset = productInfoRef.current.offsetHeight - paddingTop + 24;

      ScrollTrigger.create({
        trigger: pinTrigger.current,
        endTrigger: imagesColRef.current,
        start: "top-=24 top",
        end: `bottom ${endOffset}`,
        pin: productInfoRef.current,
        pinSpacing: false,
      });
    },
    { dependencies: [isUnderDesktop], revertOnUpdate: true },
  );
  return (
    <div className="grid grid-cols-1 pb-12 md:grid-cols-6 gap-8 md:px-4 lg:grid-cols-12 lg:gap-4 lg:px-4 lg:max-w-[1464px] lg:mx-auto">
      <div
        ref={imagesColRef}
        className="space-y-4 md:space-y-6 md:col-span-3 md:order-2 lg:col-span-6 lg:col-start-7"
      >
        {firstImage && (
          <div className="relative aspect-4/5 w-full overflow-hidden  ">
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              className="object-cover"
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        {product.images.edges.length > 1 && (
          <div className="flex flex-col gap-6">
            {product.images.edges.slice(1, 5).map(({ node: image }) => (
              <div
                key={image.id}
                className="relative aspect-4/5 w-full overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.altText || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="px-4 md:col-span-3 md:px-0 lg:col-span-3 lg:col-start-2 md:pt-40 lg:pt-60 lg:h-fit"
        ref={productInfoRef}
      >
        {product.variants.edges.length > 1 ? (
          <div ref={pinTrigger}>
            <VariantSelector
              variants={product.variants.edges.map((edge) => edge.node)}
              productTitle={product.title}
            />
          </div>
        ) : (
          <div ref={pinTrigger}>
            <Title level={1} className="lg:text-[64px] text-left mb-8 lg:mb-10">
              {product.title}
            </Title>
            <div className="bg-black text-white p-2 max-content">
              <div className="flex items-stretch border border-white">
                <AddToCartButton
                  variantId={product.variants.edges[0].node.id}
                  availableForSale={
                    product.variants.edges[0].node.availableForSale
                  }
                  variantTitle={product.variants.edges[0].node.title}
                />
                <div className="flex flex-1 border-l border-white items-center justify-center py-4 pb-3 px-8 lg:pb-2 text-[18px]">
                  <span className="text-nowrap">
                    {parseFloat(price.amount).toFixed(2)}
                    {" €"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {product.descriptionHtml && (
          <ProductDescription
            html={product.descriptionHtml}
            className="mt-6 list-disc lg:mt-15"
          />
        )}

        <ShippingInfo />
      </div>
    </div>
  );
}
