"use client";

import {
  SelectFilter,
  SelectFilterContent,
  SelectFilterItem,
  SelectFilterTrigger,
  SelectFilterValue,
} from "@/components/ui/select-filter";
import { VariantOption } from "@/lib/shopify";
import { useTranslations } from "next-intl";

interface VariantFilterProps {
  options: VariantOption[];
  selectedOptions: Record<string, string>;
  onChange: (optionName: string, value: string) => void;
}

const ALLOWED_OPTIONS = ["Couleur", "Taille", "Color", "Size"];

export function VariantFilter({
  options,
  selectedOptions,
  onChange,
}: VariantFilterProps) {
  const t = useTranslations("common");

  const filteredOptions = options.filter((option) =>
    ALLOWED_OPTIONS.includes(option.name),
  );

  if (filteredOptions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {filteredOptions.map((option) => (
        <div key={option.name} className="space-y-2">
          <SelectFilter
            value={selectedOptions[option.name] || ""}
            onValueChange={(value: string) => onChange(option.name, value)}
          >
            <SelectFilterTrigger className="uppercase lg:min-w-[240px] font-obviously-narrow text-[16px]">
              <SelectFilterValue placeholder={option.name} />
            </SelectFilterTrigger>
            <SelectFilterContent>
              <SelectFilterItem value="all">{t("all")}</SelectFilterItem>
              {option.values.map((value) => (
                <SelectFilterItem key={value} value={value}>
                  {value}
                </SelectFilterItem>
              ))}
            </SelectFilterContent>
          </SelectFilter>
        </div>
      ))}
    </div>
  );
}
