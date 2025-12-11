import { Link } from "@/lib/navigation";
import { getMenu } from "@/services/strapi/menuService";
import { StrapiMenu } from "@/types/strapi/menu";
import { LanguageSwitcher } from "./language-switcher";
import { ShoppingCartContainer } from "./navigation/cart/shopping-cart-container";
import { NavigationMenuContainer } from "./navigation/navigation-menu";

export async function Header() {
  const menu = await getMenu();

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-backdrop-filter:bg-zinc-950/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-black dark:text-zinc-50">
            NOFC
          </span>
        </Link>
        <NavigationMenuContainer menu={menu as StrapiMenu} />
        <LanguageSwitcher />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCartContainer />
          </div>
        </div>
      </div>
    </header>
  );
}
