"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShopifyCollection } from "@/lib/shopify";
import { useTranslations } from "next-intl";

interface CollectionFilterProps {
  collections: ShopifyCollection[];
  value: string;
  onChange: (value: string) => void;
}

export function CollectionFilter({
  collections,
  value,
  onChange,
}: CollectionFilterProps) {
  const t = useTranslations("common");

  const displayValue = value || "all";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black dark:text-zinc-50">
        Collection
      </label>
      <Select value={displayValue} onValueChange={(v) => onChange(v === "all" ? "" : v)}>
        <SelectTrigger>
          <SelectValue placeholder={t("allCollections")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCollections")}</SelectItem>
          {collections.map((col) => (
            <SelectItem key={col.id} value={col.handle}>
              {col.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
