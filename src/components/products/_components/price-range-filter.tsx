"use client";

import { useTranslations } from "next-intl";

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: PriceRangeFilterProps) {
  const t = useTranslations("common");

  return (
    <>
      {/* Prix minimum */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-zinc-50">
          {t("minPrice")}
        </label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Prix maximum */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-zinc-50">
          {t("maxPrice")}
        </label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="∞"
          className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>
    </>
  );
}
