import { getMenu } from "@/services/strapi/menuService";
import { StrapiMenu } from "@/types/strapi/menu";
import { Menu } from "./menu/menu";
import { ShoppingCartContainer } from "./menu/navigation/cart/shopping-cart-container";

export async function Header() {
  const menu = await getMenu();

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-backdrop-filter:bg-zinc-950/60">
      <div className="container flex items-center justify-between px-4">
        <Menu menu={menu as StrapiMenu} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCartContainer />
          </div>
        </div>
      </div>
    </header>
  );
}
