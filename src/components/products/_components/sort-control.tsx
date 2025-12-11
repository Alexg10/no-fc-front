"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <label className="text-sm font-medium text-black dark:text-zinc-50">
        {t("sortBy")}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="RELEVANCE">{tProducts("sort.relevance")}</SelectItem>
          <SelectItem value="CREATED_AT">{tProducts("sort.newest")}</SelectItem>
          <SelectItem value="PRICE">{tProducts("sort.priceAsc")}</SelectItem>
          <SelectItem value="PRICE_REVERSE">
            {tProducts("sort.priceDesc")}
          </SelectItem>
          <SelectItem value="TITLE">{tProducts("sort.nameAsc")}</SelectItem>
          <SelectItem value="TITLE_REVERSE">{tProducts("sort.nameDesc")}</SelectItem>
          <SelectItem value="BEST_SELLING">{tProducts("sort.bestSelling")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
