import Grid from "@/components/common/grid";
import { getMenu } from "@/services/strapi/menuService";
import { StrapiMenu } from "@/types/strapi/menu";
import { Menu } from "./menu/menu";
import { ShoppingCartContainer } from "./menu/navigation/cart/shopping-cart-container";

export async function Header() {
  const menu = await getMenu();

  return (
    <header className="fixed flex justify-center top-0 z-50 w-full">
      <Grid>
        <div className="col-span-full flex  items-center justify-between pt-4">
          <Menu menu={menu as StrapiMenu} />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCartContainer />
            </div>
          </div>
        </div>
      </Grid>
    </header>
  );
}
