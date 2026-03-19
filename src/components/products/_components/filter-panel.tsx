"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ShopifyCollection } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export interface PriceRange {
  key: string;
  min?: number;
  max?: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { key: "under10", max: 10 },
  { key: "range10to50", min: 10, max: 50 },
  { key: "range50to100", min: 50, max: 100 },
  { key: "over100", min: 100 },
];

const GENDER_OPTION_NAMES = ["Genre", "Gender", "Sexe cible"];
const HIDDEN_OPTION_NAMES = ["Title"];

interface FilterPanelProps {
  collections: ShopifyCollection[];
  variantOptions: { name: string; values: string[] }[];
  selectedPriceRanges: string[];
  selectedVariants: Record<string, string[]>;
  selectedCollections: string[];
  onPriceRangeChange: (ranges: string[]) => void;
  onVariantChange: (optionName: string, values: string[]) => void;
  onCollectionChange: (collections: string[]) => void;
  defaultCollection?: string;
}

export function FilterPanel({
  collections,
  variantOptions,
  selectedPriceRanges,
  selectedVariants,
  selectedCollections,
  onPriceRangeChange,
  onVariantChange,
  onCollectionChange,
  defaultCollection,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("products.filters");

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const togglePriceRange = (key: string) => {
    const next = selectedPriceRanges.includes(key)
      ? selectedPriceRanges.filter((k) => k !== key)
      : [...selectedPriceRanges, key];
    onPriceRangeChange(next);
  };

  const toggleVariant = (optionName: string, value: string) => {
    const current = selectedVariants[optionName] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onVariantChange(optionName, next);
  };

  const toggleCollection = (handle: string) => {
    const next = selectedCollections.includes(handle)
      ? selectedCollections.filter((h) => h !== handle)
      : [...selectedCollections, handle];
    onCollectionChange(next);
  };

  // Separate gender options from other variant options
  const genderOption = variantOptions.find((o) =>
    GENDER_OPTION_NAMES.includes(o.name),
  );
  const otherOptions = variantOptions.filter(
    (o) =>
      !GENDER_OPTION_NAMES.includes(o.name) &&
      !HIDDEN_OPTION_NAMES.includes(o.name),
  );

  const hasActiveFilters =
    selectedPriceRanges.length > 0 ||
    selectedCollections.length > 0 ||
    Object.values(selectedVariants).some((v) => v.length > 0);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "bg-white p-2 cursor-pointer uppercase lg:min-w-[240px] font-obviously-narrow text-[16px]",
        )}
      >
        <div className="border border-black flex items-center justify-between py-1 px-4 gap-2">
          <span className="text-black">
            {t("title")}
            {hasActiveFilters && " *"}
          </span>
          {open ? (
            <ChevronUpIcon className="size-4 text-black" />
          ) : (
            <ChevronDownIcon className="size-4 text-black" />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-[280px] bg-white border border-black p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Shop by price */}
          <FilterSection title={t("shopByPrice")}>
            {PRICE_RANGES.map((range) => (
              <FilterCheckbox
                key={range.key}
                label={t(range.key)}
                checked={selectedPriceRanges.includes(range.key)}
                onCheckedChange={() => togglePriceRange(range.key)}
              />
            ))}
          </FilterSection>

          {/* Gender */}
          {genderOption && genderOption.values.length > 0 && (
            <FilterSection title={t("gender")}>
              {genderOption.values.map((value) => (
                <FilterCheckbox
                  key={value}
                  label={value}
                  checked={(selectedVariants[genderOption.name] || []).includes(
                    value,
                  )}
                  onCheckedChange={() =>
                    toggleVariant(genderOption.name, value)
                  }
                />
              ))}
            </FilterSection>
          )}

          {/* Collection */}
          {!defaultCollection && collections.length > 0 && (
            <FilterSection title={t("collection")}>
              {collections.map((col) => (
                <FilterCheckbox
                  key={col.handle}
                  label={col.title}
                  checked={selectedCollections.includes(col.handle)}
                  onCheckedChange={() => toggleCollection(col.handle)}
                />
              ))}
            </FilterSection>
          )}

          {/* Other variant options (Size, Color, etc.) */}
          {otherOptions.map((option) => (
            <FilterSection key={option.name} title={option.name}>
              {option.values.map((value) => (
                <FilterCheckbox
                  key={value}
                  label={value}
                  checked={(selectedVariants[option.name] || []).includes(
                    value,
                  )}
                  onCheckedChange={() => toggleVariant(option.name, value)}
                />
              ))}
            </FilterSection>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 pb-2 border-t border-[#CACACA] first:border-t-0 pt-2 first:pt-0">
      <h3 className="font-bold text-m text-black">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-black">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="size-4 rounded-none border-black data-[state=checked]:bg-black data-[state=checked]:border-black"
      />
      {label}
    </label>
  );
}
