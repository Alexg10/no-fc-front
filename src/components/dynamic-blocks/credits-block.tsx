"use client";

import Grid from "@/components/common/grid/grid";
import type { StrapiArticleCredits } from "@/types/strapi";
import { BlockRendererClient } from "../common/block-renderer-client";

interface CreditsBlockProps {
  block: StrapiArticleCredits;
}

export function CreditsBlock({ block }: CreditsBlockProps) {
  const { credit } = block;
  if (!credit) return null;
  return (
    <section className="pt-0 pb-10 lg:pb-20">
      <Grid>
        <div className="col-span-full md:col-start-2 md:col-end-6 lg:col-start-5 lg:col-end-9">
          {credit && (
            <div className="text-sm flex flex-col gap-8 text-center lg:gap-11">
              {credit.map((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  <div className="text-xl-obviously text-[20px] lg:text-[24px]">
                    {item.title}
                  </div>
                  <BlockRendererClient
                    content={item.content}
                    className="text-polymath [&>p]:lg:text-[16px]!"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Grid>
    </section>
  );
}
