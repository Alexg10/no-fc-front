"use client";

import type { StrapiArticlesProduct } from "@/types/strapi";
import { Button } from "../ui/button";

interface ProductBlockProps {
  block: StrapiArticlesProduct;
}

export function ProductBlock({ block }: ProductBlockProps) {
  console.log(block);
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {block.product && (
          <div>
            <p className="text-lg">{block.product.title}</p>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400"
              dangerouslySetInnerHTML={{
                __html: block.product.description as unknown as string,
              }}
            />
            <div className="">{block.product.price.toFixed(2)} €</div>
            <div className="">
              <Button>Add to cart</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
