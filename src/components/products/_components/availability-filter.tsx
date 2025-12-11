"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface AvailabilityFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AvailabilityFilter({
  checked,
  onChange,
}: AvailabilityFilterProps) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="available"
        checked={checked}
        onCheckedChange={(c) => onChange(c === true)}
      />
      <label
        htmlFor="available"
        className="text-sm font-medium text-black dark:text-zinc-50 cursor-pointer"
      >
        {t("availableOnly")}
      </label>
    </div>
  );
}
