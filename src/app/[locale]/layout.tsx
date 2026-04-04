import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/common/footer/footer";
import { Header } from "@/components/common/header";
import {
  ConsentAwareVercel,
  TarteaucitronLoader,
} from "@/components/consent/tarteaucitron-loader";
import { AlternateLinksProvider } from "@/contexts/alternate-links-context";
import { getAbsolutePrivacyUrl } from "@/lib/tarteaucitron";
import { CartProvider } from "@/contexts/cart-context";
import { routing } from "@/routing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Valider que la locale est supportée
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Charger les messages pour la locale
  const messages = await getMessages({ locale });
  const privacyUrl = getAbsolutePrivacyUrl(locale);

  return (
    <>
      <Script
        id="tarteaucitron-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.tarteaucitronForceLanguage=${JSON.stringify(locale)};`,
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AlternateLinksProvider>
          <CartProvider>
            <TarteaucitronLoader privacyUrl={privacyUrl} />
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <CartSheet />
            <ConsentAwareVercel>
              <Analytics />
              <SpeedInsights />
            </ConsentAwareVercel>
          </CartProvider>
        </AlternateLinksProvider>
      </NextIntlClientProvider>
    </>
  );
}
