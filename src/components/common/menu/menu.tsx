"use client";

import { LogoIcons } from "@/components/icons/logo-icons";
import { Link } from "@/lib/navigation";
import { StrapiMenu } from "@/types/strapi/menu";
import { useState } from "react";
import { LanguageSwitcher } from "../language-switcher";
import { NavigationMenuContainer } from "./navigation/navigation-menu";

export function Menu({ menu }: { menu: StrapiMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white flex-col relative p-4 h-full">
      <div className="border-2 relative border-black flex items-center [&:after]:content-[''] [&:after]:w-[2px] [&:after]:h-full [&:after]:bg-black [&:after]:absolute [&:after]:top-0 [&:after]:right-1/2 [&:after]:translate-x-1/2">
        <Link href="/" className="flex items-center p-2 size-20">
          <LogoIcons />
        </Link>
        <button
          className="flex items-center p-2 size-20 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <LogoIcons />
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2 p-2 top-full right-0 w-full">
          <NavigationMenuContainer menu={menu as StrapiMenu} />
          <div className="flex">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}
