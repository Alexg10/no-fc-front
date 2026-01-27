import Grid from "@/components/common/grid/grid";
import { CartIcon } from "@/components/icons/cart-icon";
import { Link } from "@/lib/navigation";
import { getProductImages } from "@/lib/shopify";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiArticlesProduct } from "@/types/strapi";
import Image from "next/image";

interface ProductBlockProps {
  block: StrapiArticlesProduct;
  locale?: string;
}

export async function ProductBlock({ block, locale = "" }: ProductBlockProps) {
  if (!block.product) return null;

  const { product } = block;
  const productLink = `${locale ? `/${locale}` : ""}/products/${
    product.handle
  }`;

  const shopifyImages = await getProductImages(product.handle);
  const firstImage = shopifyImages?.images.edges[0]?.node;
  const imageUrl =
    firstImage?.url || (product.image?.url ? product.image.url : null);
  const imageAlt =
    firstImage?.altText || product.image?.alternativeText || product.title;
  const backgroundImage = block?.backgroundImage?.url
    ? getStrapiImageUrl(block.backgroundImage.url)
    : null;

  return (
    <section className="py-12">
      <Grid>
        <div
          className="col-span-full md:col-start-2 md:col-end-6 lg:col-start-4 lg:col-end-10 grid grid-cols-1 gap-8 items-center px-10 py-16 md:px-16 lg:py-30"
          style={{
            backgroundImage: `url(${backgroundImage || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col w-full max-w-[350px] mx-auto">
            <Link
              href={productLink}
              className="relative w-full overflow-hidden flex flex-col"
            >
              {imageUrl && (
                <div className="relative w-full aspect-4/5 overflow-hidden ">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                  />
                </div>
              )}
              <div className="bg-white flex p-4 pt-6 pb-10 lg:pb-17 justify-between border-t-2 border-black">
                <h2 className="text-polymath-display max-w-2/3">
                  {product.title}
                </h2>
                <div className="text-polymath">
                  {product.price.toFixed(2)} €
                </div>
              </div>
            </Link>
            <div className="flex flex-col mt-2">
              <div className="flex flex-col">
                <Link href={productLink} className="w-full bg-pink p-2">
                  <div className="border border-black flex items-center">
                    <div className="text-xl-obviously text-[16px] lg:text-[24px] flex items-center gap-3 px-4 py-4 border-r border-black">
                      <CartIcon />
                      Add to cart
                    </div>
                    <div className="text-polymath flex justify-center items-center text-center flex-1">
                      {product.price.toFixed(2)} €
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </section>
  );
}
