import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { CartProvider } from "@/contexts/cart-context";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/routing";
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSheet />
      </CartProvider>
    </NextIntlClientProvider>
  );
}

