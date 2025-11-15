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
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItemSkeleton } from "./skeleton/cart-item-skeleton";

export function CartSheet() {
  const { cart, isLoading, updateQuantity, removeLine, isOpen, closeCart } =
    useCart();

  const cartItems = cart?.lines.edges || [];
  const totalAmount = cart?.cost.totalAmount.amount || "0";
  const currencyCode = cart?.cost.totalAmount.currencyCode || "EUR";

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Panier</SheetTitle>
          <SheetDescription>
            {cartItems.length === 0
              ? "Votre panier est vide"
              : `${cart?.totalQuantity || 0} article${
                  (cart?.totalQuantity || 0) > 1 ? "s" : ""
                }`}
          </SheetDescription>
        </SheetHeader>

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
            <p className="text-zinc-600 dark:text-zinc-400">
              Votre panier est vide
            </p>
            <Button asChild variant="outline" onClick={closeCart}>
              <Link href="/products">Voir les produits</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {cartItems.map(({ node: line }) => {
                  const image =
                    line.merchandise.product.images.edges[0]?.node.url;
                  const productHandle = line.merchandise.product.handle;

                  return (
                    <div
                      key={line.id}
                      className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                    >
                      {image && (
                        <Link
                          href={`/products/${productHandle}`}
                          onClick={closeCart}
                          className="relative shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800"
                        >
                          <Image
                            src={image}
                            alt={
                              line.merchandise.product.images.edges[0]?.node
                                .altText || line.merchandise.product.title
                            }
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>
                      )}

                      <div className="flex-1 flex flex-col gap-2">
                        <div>
                          <Link
                            href={`/products/${productHandle}`}
                            onClick={closeCart}
                            className="font-medium text-black dark:text-zinc-50 hover:underline"
                          >
                            {line.merchandise.product.title}
                          </Link>
                          {line.merchandise.title !== "Default Title" && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {line.merchandise.title}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity - 1)
                              }
                              disabled={isLoading || line.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium text-black dark:text-zinc-50">
                              {line.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity + 1)
                              }
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-black dark:text-zinc-50">
                              {(
                                parseFloat(line.merchandise.price.amount) *
                                line.quantity
                              ).toFixed(2)}{" "}
                              {line.merchandise.price.currencyCode}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => removeLine(line.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="flex-col gap-4 sm:flex-row">
              <div className="flex items-center justify-between w-full text-lg font-semibold text-black dark:text-zinc-50">
                <span>Total:</span>
                <span>
                  {parseFloat(totalAmount).toFixed(2)} {currencyCode}
                </span>
              </div>
              {cart?.checkoutUrl && (
                <Button asChild className="w-full" size="lg">
                  <Link href={cart.checkoutUrl} target="_blank">
                    Passer la commande
                  </Link>
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
