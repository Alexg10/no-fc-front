"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CartIcon } from "./icons/cart-icon";

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
  variantTitle?: string;
  fullWidth?: boolean;
}

export function AddToCartButton({
  variantId,
  availableForSale,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const t = useTranslations("common");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!availableForSale) return;

    try {
      setIsAdding(true);
      await addToCart(variantId, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(t("error"));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!availableForSale || isLoading || isAdding}
      className="transition-colors cursor-pointer px-6 lg:px-4 disabled:opacity-50 disabled:cursor-not-allowed lg:text-[24px]! "
    >
      {isAdding || isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("addingInProgress")}
        </>
      ) : !availableForSale ? (
        t("outOfStock")
      ) : (
        <div className="flex items-center gap-3">
          <CartIcon className="size-6" />
          {t("addToCart")}
        </div>
      )}
    </Button>
  );
}
