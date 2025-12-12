"use client";

import { Link } from "@/lib/navigation";
import { StrapiMenu } from "@/types/strapi/menu";

export function NavigationMenuContainer({ menu }: { menu: StrapiMenu }) {
  return (
    <nav className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {menu.links.map((link) => (
          <li key={link.id}>
            <Link href={link.link}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
