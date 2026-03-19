"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

interface SortControlProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "RELEVANCE", key: "featured" },
  { value: "CREATED_AT", key: "newest" },
  { value: "PRICE_REVERSE", key: "priceDesc" },
  { value: "PRICE", key: "priceAsc" },
] as const;

export function SortControl({ value, onChange }: SortControlProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tSort = useTranslations("products.sort");

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

  const handleSelect = (sortValue: string) => {
    onChange(sortValue);
    setOpen(false);
  };

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
          <span className="text-black">{tSort("title")}</span>
          {open ? (
            <ChevronUpIcon className="size-4 text-black" />
          ) : (
            <ChevronDownIcon className="size-4 text-black" />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-1 w-[240px] bg-white border border-black p-4 space-y-2">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-black"
            >
              <span
                className={cn(
                  "size-4 rounded-full border border-black flex items-center justify-center shrink-0",
                )}
              >
                {value === option.value && (
                  <span className="size-2.5 rounded-full bg-black" />
                )}
              </span>
              <button
                type="button"
                className="text-left cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                {tSort(option.key)}
              </button>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
