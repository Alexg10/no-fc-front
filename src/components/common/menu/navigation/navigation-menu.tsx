"use client";

import { Link } from "@/lib/navigation";
import { StrapiMenu } from "@/types/strapi/menu";

interface NavigationMenuContainerProps {
  menu: StrapiMenu;
  onLinkClick?: () => void;
}

export function NavigationMenuContainer({
  menu,
  onLinkClick,
}: NavigationMenuContainerProps) {
  return (
    <nav className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {menu.links.map((link) => (
          <li key={link.id}>
            <Link href={link.link} onClick={onLinkClick}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
