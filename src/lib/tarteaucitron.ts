import { defaultLocale } from "@/routing";

/** Localized path for legal pages (next-intl `localePrefix: as-needed`). */
export function getLocalizedLegalPath(
  locale: string,
  path: "/privacy-policy" | "/terms-and-conditions",
): string {
  if (locale === defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

export function getAbsolutePrivacyUrl(locale: string): string {
  const relative = getLocalizedLegalPath(locale, "/privacy-policy");
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  return base ? `${base}${relative}` : relative;
}
