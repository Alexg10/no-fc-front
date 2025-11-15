"use client";

import { getStrapiImageUrl } from "@/lib/strapi";
import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface BlockRendererClientProps {
  content: BlocksContent;
}

export function BlockRendererClient({ content }: BlockRendererClientProps) {
  if (!content) return null;

  return (
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
          <p className="mb-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {children}
          </p>
        ),
        heading: ({ children, level }) => {
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          const classes = {
            1: "text-4xl font-bold text-black dark:text-zinc-50 mb-6 mt-8",
            2: "text-3xl font-bold text-black dark:text-zinc-50 mb-5 mt-7",
            3: "text-2xl font-semibold text-black dark:text-zinc-50 mb-4 mt-6",
            4: "text-xl font-semibold text-black dark:text-zinc-50 mb-3 mt-5",
            5: "text-lg font-medium text-black dark:text-zinc-50 mb-2 mt-4",
            6: "text-base font-medium text-black dark:text-zinc-50 mb-2 mt-3",
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
            <ListTag className="mb-4 ml-6 list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
              {children}
            </ListTag>
          );
        },
        quote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-700 dark:text-zinc-300">
            {children}
          </blockquote>
        ),
        code: ({ plainText }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4">
            <code className="text-sm text-zinc-800 dark:text-zinc-200">
              {plainText}
            </code>
          </pre>
        ),
        link: ({ children, url }) => (
          <a
            href={url}
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target={url.startsWith("http") ? "_blank" : "_self"}
            rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
      }}
    />
  );
}

