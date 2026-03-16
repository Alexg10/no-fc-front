import { CartSheet } from "@/components/cart-sheet";
import { Header } from "@/components/common/header";
import { LogoIcons } from "@/components/icons/logo-icons";
import { JugglingGame } from "@/components/not-found/juggling-game";
import { ButtonLink } from "@/components/ui/button-link";
import { CartProvider } from "@/contexts/cart-context";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Marquee from "react-fast-marquee";

export default async function NotFound() {
  const locale = "fr";
  const messages = (await import(`../../messages/${locale}/index.ts`)).default;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <Suspense>
          <Header locale={locale} />
        </Suspense>

        <main
          className="relative z-20 h-screen overflow-hidden bg-black flex flex-col items-center justify-center gap-8 lg:gap-12"
          style={{
            backgroundImage: "url(/images/404/texture-404.png)",
          }}
        >
          {/* 404 marquee badge */}
          <div className="border border-white bg-white w-[200px] overflow-hidden pointer-events-none">
            <Marquee
              autoFill
              speed={40}
              className="flex items-center text-obviously text-black text-[24px] uppercase py-2"
            >
              <span className="mr-3">404</span>
              <LogoIcons className="size-5 mr-3 text-black translate-y-px" />
            </Marquee>
          </div>

          {/* Main heading */}
          <div className="text-center px-4 pointer-events-none">
            <h1 className="heading-xl-obviously text-white title-shadow leading-[82%]">
              NO CLUBS.
              <br />
              NO COLORS.
              <br />
              NO PAGE.
            </h1>
          </div>

          {/* Back home button */}
          <ButtonLink
            href="/"
            variant="secondary"
            hasIcon={false}
            className="flex flex-row items-center gap-2 [&>div>div]:flex [&>div>div]:items-center"
          >
            <LogoIcons className="size-5 mr-3 text-black translate-y-px" />
            {t("backHome")}
          </ButtonLink>

          {/* Juggling game overlay */}
          <JugglingGame />
        </main>

        <CartSheet />
      </CartProvider>
    </NextIntlClientProvider>
  );
}
