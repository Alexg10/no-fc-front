import { Link } from "@/lib/navigation";
import type { ShopifyProduct } from "@/lib/shopify";
import Image from "next/image";

interface ProductCardProps {
  product: ShopifyProduct;
  locale?: string;
  isAboveFold?: boolean;
  href?: string;
}

export function ProductCard({
  product,
  locale = "",
  isAboveFold = false,
  href,
}: ProductCardProps) {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const productHref =
    href || `${locale ? `/${locale}` : ""}/products/${product.handle}`;

  return (
    <Link
      href={productHref}
      className="group flex flex-col bg-off-white overflow-hidden border-black transition-all duration-300 border-2"
    >
      <div className="relative aspect-square overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading={isAboveFold ? "eager" : "lazy"}
            priority={isAboveFold}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col lg:flex-row justify-between gap-4 border-t-2 border-black lg:pb-13 bg-off-white">
        <h2 className="text-polymath-display text-[16px] mb-2 line-clamp-2 ">
          {product.title}
        </h2>

        <div className="text-polymath text-[16px] text-black text-nowrap">
          {parseFloat(price.amount).toFixed(2)} €
        </div>
      </div>
    </Link>
  );
}
