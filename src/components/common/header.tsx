"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useCart } from "@/contexts/cart-context";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const { cart, openCart } = useCart();
  const t = useTranslations("navigation");
  const itemCount = cart?.totalQuantity || 0;

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-backdrop-filter:bg-zinc-950/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-black dark:text-zinc-50">
            NOFC
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    {t("home")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className={navigationMenuTriggerStyle()}
                  >
                    {t("products")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="icon"
              onClick={openCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
