"use client";

import { CartIcon } from "@/components/icons/cart-icon";
import { Title } from "@/components/ui/title";
import { useCart } from "@/contexts/cart-context";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface VariantOption {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface VariantSelectorProps {
  variants: VariantOption[];
  productTitle: string;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function VariantSelector({
  variants,
  productTitle,
}: VariantSelectorProps) {
  const t = useTranslations("products");
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(
    variants.find((v) => v.availableForSale) || null,
  );
  const [isAdding, setIsAdding] = useState(false);

  // Grouper les variants par taille (mémorisé)
  const sizeVariants = useMemo(
    () =>
      variants.reduce(
        (acc, variant) => {
          const sizeOpt = variant.selectedOptions.find(
            (opt) => opt.name === "Size" || opt.name === "Taille",
          );
          if (sizeOpt) {
            acc[sizeOpt.value] = variant;
          }
          return acc;
        },
        {} as Record<string, VariantOption>,
      ),
    [variants],
  );

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;

    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const selectedPrice = selectedVariant?.price;

  return (
    <div className="space-y-10 lg:space-y-6">
      {/* Titre du produit */}
      <Title
        level={1}
        className="text-left tracking-normal mb-8 lg:text-[64px] lg:mb-10"
      >
        {productTitle}
      </Title>

      {/* Sélecteur de taille */}
      <div className="space-y-3 ">
        <div className="flex gap-5 lg:gap-3">
          {AVAILABLE_SIZES.map((size) => {
            const variant = sizeVariants[size];
            const isAvailable = variant?.availableForSale;
            const isSelected = selectedVariant?.id === variant?.id;

            return (
              <button
                key={size}
                onClick={() =>
                  variant && isAvailable && setSelectedVariant(variant)
                }
                disabled={!isAvailable}
                className={`text-[18px] px-[4px]  uppercase p-1 min-w-[27px] h-[27px]
                  transition-all duration-200 text-polymath
                  ${
                    isSelected
                      ? "bg-black text-white "
                      : isAvailable
                        ? "bg-white text-black hover:border-black  cursor-pointer"
                        : "text-black/20 cursor-not-allowed "
                  }
                `}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bouton Add to Cart + Prix */}
      <div className="bg-black text-white p-2">
        <div className="flex items-stretch border border-white">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale || isAdding}
            className={`flex-1 flex items-center text-nowrap justify-center gap-3 lg:text-[24px] px-6 py-4 lg:px-2 text-obviously uppercase md:flex-2  transition-all duration-200 border-r border-white
              ${
                selectedVariant?.availableForSale
                  ? "hover:bg-black hover:text-white"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
          >
            <CartIcon />
            {isAdding ? t("adding") : t("addToCart")}
          </button>
          <div className="flex flex-1 text-nowrap items-center justify-center px-8 text-[18px]">
            <span className="">
              {selectedPrice
                ? `${parseFloat(selectedPrice.amount).toFixed(2)} €`
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Message de disponibilité */}
      {selectedVariant && !selectedVariant.availableForSale && (
        <p className="text-red-600 font-semibold">{t("outOfStock")}</p>
      )}
    </div>
  );
}
