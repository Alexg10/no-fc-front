"use client";

import { useAlternateLinks } from "@/contexts/alternate-links-context";
import { usePathname, useRouter } from "@/lib/navigation";
import { routing } from "@/routing";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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
    <div
      className={`flex items-center gap-1 text-base uppercase ${isPending ? "pointer-events-none opacity-50" : ""}`}
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <button
            onClick={() => handleLocaleChange(loc)}
            disabled={isPending}
            className={`cursor-pointer transition-colors ${
              loc === currentLocale
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
