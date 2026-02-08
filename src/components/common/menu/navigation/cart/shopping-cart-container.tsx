"use client";

import { ItemIcon } from "@/components/icons/item-icon";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export function ShoppingCartContainer() {
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity || 0;
  return (
    <div className="absolute top-0 right-0 p-2 lg:p-3 bg-white">
      <Button
        variant="outline"
        size="icon"
        onClick={openCart}
        className="relative cursor-pointer rounded-none size-11 lg:size-16 flex items-center justify-center border-2"
      >
        <ItemIcon className="size-6" />
        {itemCount > 0 && (
          <span className="absolute -bottom-[6px] -right-2 flex justify-center size-4 text-obviously uppercase items-center text-[12px] rounded-full bg-pink text-black">
            <div className="-translate-y-1 lg:-translate-y-0.5">
              {itemCount > 99 ? "99+" : itemCount}
            </div>
          </span>
        )}
      </Button>
    </div>
  );
}
