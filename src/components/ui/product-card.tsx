import { Link } from "@/lib/navigation";
import type { ShopifyProduct } from "@/lib/shopify";
import Marquee from "react-fast-marquee";
import { ProductCardCarousel } from "./product-card-carousel";

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
  const images = product.images.edges.map(({ node }) => node);
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const productHref =
    href || `${locale ? `/${locale}` : ""}/products/${product.handle}`;

  return (
    <Link
      href={productHref}
      className="group flex flex-col bg-off-white overflow-hidden border-black transition-all duration-300 border-2"
    >
      <div className="relative aspect-square overflow-hidden">
        <ProductCardCarousel
          images={images}
          productTitle={product.title}
          isAboveFold={isAboveFold}
        />
        {product.availableForSale === false && (
          <div className="absolute bottom-0 left-0 w-full bg-black text-white overflow-hidden">
            <Marquee
              autoFill
              speed={30}
              className="text-nowrap text-obviously text-[24px] uppercase py-4"
            >
              <span className="mx-4">Sold out</span>
            </Marquee>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col lg:flex-row justify-between gap-4 border-t-2 border-black lg:pb-13 bg-off-white">
        <h2 className="text-polymath-display text-[16px] mb-2 line-clamp-2 ">
          {product.title}
        </h2>
        <div className="text-polymath flex-col text-[16px] text-black text-nowrap flex">
          <span>{parseFloat(price.amount).toFixed(2)} €</span>
          {hasDiscount && compareAtPrice && (
            <span className="line-through opacity-40">
              {parseFloat(compareAtPrice.amount).toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
