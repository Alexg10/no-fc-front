"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/lib/navigation";
import { routing } from "@/routing";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const localeNames: Record<string, string> = {
  fr: "Français",
  en: "English",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentLocale = (params?.locale as string) || routing.defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      const queryString = searchParams.toString();
      const newPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newPath, { locale: newLocale });
    });
  };

  return (
    <Select
      value={currentLocale}
      onValueChange={handleLocaleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-auto lg:w-[140px]">
        <SelectValue>
          {localeNames[currentLocale] || currentLocale.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc] || loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
