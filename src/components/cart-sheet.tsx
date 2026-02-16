"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { Link } from "@/lib/navigation";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CartIcon } from "./icons/cart-icon";
import { CartItemSkeleton } from "./skeleton/cart-item-skeleton";

export function CartSheet() {
  const { cart, isLoading, updateQuantity, removeLine, isOpen, closeCart } =
    useCart();
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");

  const cartItems = cart?.lines.edges || [];
  const totalAmount = cart?.cost.totalAmount.amount || "0";
  const currencyCode = cart?.cost.totalAmount.currencyCode || "EUR";

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg p-4 bg-off-white">
        <SheetHeader className="sr-only">
          <SheetTitle className="sr-only">{t("title")}</SheetTitle>
          <SheetDescription className="sr-only">
            {cartItems.length === 0
              ? t("empty")
              : t("items", { count: cart?.totalQuantity || 0 })}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 h-full border-2 border-black overflow-auto">
          {isLoading && cartItems.length === 0 ? (
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12">
              <ShoppingBag className="w-16 h-16 text-zinc-400 dark:text-zinc-600" />
              <p className="text-zinc-600 dark:text-zinc-400">{t("empty")}</p>
              <Button asChild variant="outline" onClick={closeCart}>
                <Link href="/products">{tCommon("seeProducts")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 ">
                <div className="flex flex-col gap-4 pt-20">
                  {cartItems.map(({ node: line }) => {
                    const image =
                      line.merchandise.product.images.edges[0]?.node.url;
                    const productHandle = line.merchandise.product.handle;

                    return (
                      <div
                        key={line.id}
                        className="flex gap-4 border-b-2 border-black py-4"
                      >
                        {image && (
                          <Link
                            href={`/products/${productHandle}`}
                            onClick={closeCart}
                            className="relative shrink-0 w-20 h-30 overflow-hidden "
                          >
                            <Image
                              src={image}
                              alt={
                                line.merchandise.product.images.edges[0]?.node
                                  .altText || line.merchandise.product.title
                              }
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                          </Link>
                        )}

                        <div className="flex-1 flex flex-col gap-2 justify-between ">
                          <div className="flex flex-col items-start h-full gap-0">
                            <div className="flex flex-col gap-1">
                              <Link
                                href={`/products/${productHandle}`}
                                onClick={closeCart}
                                className="font-polymath-display text-[16px] hover:underline"
                              >
                                {line.merchandise.product.title}
                              </Link>
                              {line.merchandise.title !== "Default Title" && (
                                <p className="text-grey text-[14px]">
                                  {t("size")}: {line.merchandise.title}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-grey text-[14px]">
                              {t("quantity")}
                              <div className="flex gap-1 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-none flex items-center justify-center bg-transparent shadow-none p-0"
                                  onClick={() =>
                                    updateQuantity(line.id, line.quantity - 1)
                                  }
                                  disabled={isLoading || line.quantity <= 1}
                                >
                                  <Minus className="size-3 text-grey" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium text-grey ">
                                  {line.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 border-none flex items-center justify-center  bg-transparent shadow-none p-0"
                                  onClick={() =>
                                    updateQuantity(line.id, line.quantity + 1)
                                  }
                                  disabled={isLoading}
                                >
                                  <Plus className="size-3 text-grey" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-between w-full">
                            <Button
                              variant="ghost"
                              className="underline text-black bg-transparent p-0 font-polymath-text! border-none text-[16px] normal-case"
                              onClick={() => removeLine(line.id)}
                              disabled={isLoading}
                            >
                              {t("remove")}
                            </Button>
                            <span className="font-polymath-text! text-black ">
                              {formatPrice(
                                parseFloat(line.merchandise.price.amount) *
                                  line.quantity,
                                line.merchandise.price.currencyCode,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <SheetFooter className="flex-col gap-4  pt-0">
                <p className="text-grey text-[12px]">{t("shippingInfos")}</p>
                {cart?.checkoutUrl && (
                  <Button
                    asChild
                    className="w-full rounded-none text-black bg-pink hover:bg-pink/90 border-none p-2 h-auto"
                    size="lg"
                  >
                    <Link href={cart.checkoutUrl} target="_blank">
                      <div className="border border-black h-full w-full flex items-center justify-between p-4">
                        <div className="flex gap-2 lg:gap-3 items-center text-[24px] text-nowrap">
                          <CartIcon className="size-5 lg:size-6 translate-y-[2px]" />
                          {t("checkout")}
                        </div>
                        <span className="font-polymath-text! text-nowrap h-full flex items-center justify-center">
                          {formatPrice(totalAmount, currencyCode)}
                        </span>
                      </div>
                    </Link>
                  </Button>
                )}
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
