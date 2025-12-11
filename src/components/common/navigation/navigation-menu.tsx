"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@/lib/navigation";
import { StrapiMenu } from "@/types/strapi/menu";

export function NavigationMenuContainer({ menu }: { menu: StrapiMenu }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menu.links.map((link) => (
          <NavigationMenuItem key={link.id}>
            <NavigationMenuLink asChild>
              <Link href={link.link} className={navigationMenuTriggerStyle()}>
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
