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
  const productHref = href || `${locale ? `/${locale}` : ""}/products/${product.handle}`;

  return (
    <Link
      href={productHref}
      className="group flex flex-col bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
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

      <div className="p-4 flex flex-col grow">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {product.title}
        </h2>

        {product.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2 grow">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="text-xl font-bold text-black dark:text-zinc-50">
            {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
          </div>
        </div>
      </div>
    </Link>
  );
}
