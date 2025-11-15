"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
  variantTitle?: string;
  fullWidth?: boolean;
}

export function AddToCartButton({
  variantId,
  availableForSale,
  variantTitle,
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!availableForSale) return;

    try {
      setIsAdding(true);
      await addToCart(variantId, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Erreur lors de l'ajout au panier. Veuillez réessayer.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!availableForSale || isLoading || isAdding}
      className={`bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? "w-full py-3 px-6" : "py-2 px-4 whitespace-nowrap"
      }`}
      size={fullWidth ? "lg" : "sm"}
    >
      {isAdding || isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {fullWidth ? "Ajout en cours..." : "Ajout..."}
        </>
      ) : !availableForSale ? (
        fullWidth ? (
          "Rupture de stock"
        ) : (
          "Rupture"
        )
      ) : fullWidth ? (
        "Ajouter au panier"
      ) : (
        "Ajouter"
      )}
    </Button>
  );
}
