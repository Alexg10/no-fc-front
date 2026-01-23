"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface BlockRendererClientProps {
  content: BlocksContent;
  className?: string;
}

export function BlockRendererClient({ content, className }: BlockRendererClientProps) {
  if (!content) return null;

  return (
    <div className={className}>
      <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          const imageUrl = getStrapiImageUrl(image.url);
          return (
            <div className="relative my-8 w-full">
              <Image
                src={imageUrl}
                width={image.width || 800}
                height={image.height || 600}
                alt={image.alternativeText || ""}
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              />
            </div>
          );
        },
        paragraph: ({ children }) => (
          <p className="mb-4 leading-relaxed">
            {children}
          </p>
        ),
        heading: ({ children, level }) => {
          const HeadingTag = `h${level}` as
            | "h1"
            | "h2"
            | "h3"
            | "h4"
            | "h5"
            | "h6";
          const classes = {
            1: "text-4xl font-bold mb-6 mt-8",
            2: "text-3xl font-bold mb-5 mt-7",
            3: "text-2xl font-semibold mb-4 mt-6",
            4: "text-xl font-semibold mb-3 mt-5",
            5: "text-lg font-medium mb-2 mt-4",
            6: "text-base font-medium mb-2 mt-3",
          };
          return (
            <HeadingTag className={classes[level as keyof typeof classes]}>
              {children}
            </HeadingTag>
          );
        },
        list: ({ children, format }) => {
          const ListTag = format === "ordered" ? "ol" : "ul";
          return (
            <ListTag className="mb-4 ml-6 list-disc space-y-2">
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
            <code className="text-sm">
              {plainText}
            </code>
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
