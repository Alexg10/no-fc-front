"use client";

import {
  SelectFilter,
  SelectFilterContent,
  SelectFilterItem,
  SelectFilterTrigger,
  SelectFilterValue,
} from "@/components/ui/select-filter";
import { useTranslations } from "next-intl";

interface SortControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortControl({ value, onChange }: SortControlProps) {
  const t = useTranslations("common");
  const tProducts = useTranslations("products");

  return (
    <div className="space-y-2">
      <SelectFilter value={value} onValueChange={onChange}>
        <SelectFilterTrigger className="uppercase lg:min-w-[240px] font-obviously-narrow text-[16px]">
          <SelectFilterValue placeholder={t("sortBy")} />
        </SelectFilterTrigger>
        <SelectFilterContent>
          <SelectFilterItem value="RELEVANCE">
            {tProducts("sort.relevance")}
          </SelectFilterItem>
          <SelectFilterItem value="CREATED_AT">
            {tProducts("sort.newest")}
          </SelectFilterItem>
          <SelectFilterItem value="PRICE">
            {tProducts("sort.priceAsc")}
          </SelectFilterItem>
          <SelectFilterItem value="PRICE_REVERSE">
            {tProducts("sort.priceDesc")}
          </SelectFilterItem>
          <SelectFilterItem value="TITLE">
            {tProducts("sort.nameAsc")}
          </SelectFilterItem>
          <SelectFilterItem value="TITLE_REVERSE">
            {tProducts("sort.nameDesc")}
          </SelectFilterItem>
          <SelectFilterItem value="BEST_SELLING">
            {tProducts("sort.bestSelling")}
          </SelectFilterItem>
        </SelectFilterContent>
      </SelectFilter>
    </div>
  );
}
