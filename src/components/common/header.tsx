import Grid from "@/components/common/grid";
import { getGeneral } from "@/services/strapi/generalService";
import { getMenu } from "@/services/strapi/menuService";
import { StrapiMarquee } from "@/types/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import { Menu } from "./menu/menu";
import { ShoppingCartContainer } from "./menu/navigation/cart/shopping-cart-container";

export async function Header() {
  const menu = await getMenu();
  const general = await getGeneral();

  return (
    <header className="fixed flex justify-center top-0 z-50 w-full">
      <Grid>
        <div className="col-span-full flex relative items-center justify-between top-4 lg:top-6">
          <Menu
            menu={menu as StrapiMenu}
            marquee={general?.marquee as StrapiMarquee}
          />
          <ShoppingCartContainer />
        </div>
      </Grid>
    </header>
  );
}
