"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticleColumns } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface ColumnsBlockProps {
  block: StrapiArticleColumns;
}

export function ColumnsBlock({ block }: ColumnsBlockProps) {
  const { intro, column } = block;

  return (
    <section className="pb-19">
      <Grid className="gap-y-8">
        <div className="col-span-full md:col-span-3 lg:col-start-2 lg:col-span-5">
          {intro && (
            <BlockRendererClient
              content={intro as BlocksContent}
              className="text-l-polymath [&>p]:text-polymath-text "
            />
          )}
        </div>
        <div className="col-span-full lg:col-start-2 lg:col-end-12">
          {column && column.length > 0 && (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-14 lg:gap-6">
              {column.map((item) => {
                const columnBlockItem = item.columnBlockItem;
                return (
                  <div
                    key={item.id}
                    className="col-span-full md:col-span-1 lg:col-span-5 space-y-8"
                  >
                    {columnBlockItem?.map((subItem) => {
                      return (
                        <div key={subItem.id} className="flex flex-col gap-6">
                          <h3 className="text-l-polymath font-bold mb-4">
                            {subItem.heading}
                          </h3>
                          {subItem.image && (
                            <Image
                              src={getStrapiImageUrl(subItem.image.url)}
                              alt={
                                subItem.image.alternativeText ||
                                subItem.heading ||
                                ""
                              }
                              width={subItem.image.width || 800}
                              height={subItem.image.height || 600}
                            />
                          )}
                          {subItem.content && (
                            <BlockRendererClient
                              content={subItem.content as BlocksContent}
                              className="text-l-polymath"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Grid>
    </section>
  );
}
