import Grid from "@/components/common/grid";
import { HeaderContainer } from "@/components/common/header-container";
import { getGeneral } from "@/services/strapi/generalService";
import { getMenu } from "@/services/strapi/menuService";
import { StrapiMarquee } from "@/types/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import { Menu } from "./menu/menu";
import { ShoppingCartContainer } from "./menu/navigation/cart/shopping-cart-container";

export async function Header({ locale }: { locale: string }) {
  const [menu, general] = await Promise.all([
    getMenu(locale),
    getGeneral(locale),
  ]);

  return (
    <header className="fixed flex justify-center top-0 z-50 w-full">
      <Grid>
        <HeaderContainer>
          <Menu
            menu={menu as StrapiMenu}
            marquee={general?.marquee as StrapiMarquee}
          />
          <ShoppingCartContainer />
        </HeaderContainer>
      </Grid>
    </header>
  );
}
