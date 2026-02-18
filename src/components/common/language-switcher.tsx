"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlternateLinks } from "@/contexts/alternate-links-context";
import { usePathname, useRouter } from "@/lib/navigation";
import { routing } from "@/routing";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const localeNames: Record<string, string> = {
  fr: "Fr",
  en: "En",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { alternateLinks } = useAlternateLinks();

  const currentLocale = (params?.locale as string) || routing.defaultLocale;

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      const queryString = searchParams.toString();

      // Si un lien alternatif existe pour ce locale (ex: article avec slug traduit)
      if (alternateLinks[newLocale]) {
        const alternatePath = queryString
          ? `${alternateLinks[newLocale]}?${queryString}`
          : alternateLinks[newLocale];
        router.push(alternatePath);
        return;
      }

      // Comportement par défaut : même chemin, locale changée
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
      <SelectTrigger className="w-auto uppercase text-[16px] lg:w-full border-none p-0 shadow-none [&_svg]:opacity-100 h-fit!">
        <SelectValue>
          {localeNames[currentLocale] || currentLocale.toUpperCase()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => {
          return (
            <SelectItem key={loc} value={loc}>
              {loc.toUpperCase()}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
