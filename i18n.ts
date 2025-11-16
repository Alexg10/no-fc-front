import { getRequestConfig } from "next-intl/server";
import { routing } from "./src/routing";

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale est supportée
  let validLocale: string = locale || routing.defaultLocale;
  if (
    !routing.locales.includes(validLocale as (typeof routing.locales)[number])
  ) {
    validLocale = routing.defaultLocale;
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}/index.ts`)).default,
  };
});

// Réexporter pour compatibilité
export { defaultLocale, locales, type Locale } from "./src/routing";
