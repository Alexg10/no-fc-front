import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/common/footer/footer";
import { Header } from "@/components/common/header";
import { CartProvider } from "@/contexts/cart-context";
import { routing } from "@/routing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <CartSheet />
        <Analytics />
        <SpeedInsights />
      </CartProvider>
    </NextIntlClientProvider>
  );
}
