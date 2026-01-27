"use client";

import { createHeadingElement } from "@/lib/heading-utils";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface BlockRendererClientProps {
  content: BlocksContent;
  className?: string;
}

export function BlockRendererClient({
  content,
  className,
}: BlockRendererClientProps) {
  if (!content) return null;

  return (
    <div className={cn(className, "block-renderer")}>
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image }) => {
            const imageUrl = getStrapiImageUrl(image.url);
            return (
              <div className="relative mt-10 mb-6 w-full">
                <Image
                  src={imageUrl}
                  width={image.width || 800}
                  height={image.height || 600}
                  alt={image.alternativeText || ""}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                />
              </div>
            );
          },
          paragraph: ({ children }) => (
            <p className="mb-2 text-l-polymath">{children}</p>
          ),
          heading: ({ children, level }) => {
            const classes = {
              1: "text-4xl font-bold mb-6 mt-8",
              2: "text-3xl font-bold mb-5 mt-7",
              3: "text-xl-polymath-display font-bold mb-6 mt-6",
              4: "text-xl font-semibold mb-3 mt-5",
              5: "text-lg font-medium mb-2 mt-4",
              6: "text-base font-medium mb-2 mt-3",
            };
            return createHeadingElement(level as 1 | 2 | 3 | 4 | 5 | 6, {
              className: classes[level as keyof typeof classes],
              children,
            });
          },
          list: ({ children, format }) => {
            const ListTag = format === "ordered" ? "ol" : "ul";
            const listClasses =
              format === "ordered"
                ? "mb-4 ml-6 list-decimal space-y-2"
                : "mb-4 ml-6 !list-none space-y-2 [&>li]:before:content-[''] text-[18px] [&>li]:before:absolute [&>li]:before:-left-[14px] [&>li]:before:top-3 [&>li]:before:size-[3px] [&>li]:before:rounded-full [&>li]:before:bg-current";
            return (
              <ListTag className={cn("relative [&>li]:relative", listClasses)}>
                {children}
              </ListTag>
            );
          },
          quote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-current pl-4 italic opacity-75">
              {children}
            </blockquote>
          ),
          code: ({ plainText }) => (
            <pre className="my-4 overflow-x-auto rounded-lg bg-current bg-opacity-10 p-4">
              <code className="text-sm">{plainText}</code>
            </pre>
          ),
          link: ({ children, url }) => (
            <a
              href={url}
              className="underline hover:opacity-75"
              target={url.startsWith("http") ? "_blank" : "_self"}
              rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
}
