"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart } from "lucide-react";

export function ShoppingCartContainer() {
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity || 0;
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={openCart}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
