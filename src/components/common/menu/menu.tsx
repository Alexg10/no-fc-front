"use client";

import { LogoIcons } from "@/components/icons/logo-icons";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { StrapiMenu } from "@/types/strapi/menu";
import { useState } from "react";
import { LanguageSwitcher } from "../language-switcher";
import { NavigationMenuContainer } from "./navigation/navigation-menu";

export function Menu({ menu }: { menu: StrapiMenu }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute top-0 left-0 flex-col h-full">
      <div className="relative bg-white p-4 ">
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
        <div
          className={cn(
            "top-full right-0 w-full grid transition-all duration-300 ease-in-out",
            isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr] "
          )}
        >
          <div className="overflow-hidden">
            <div className="p-2 pt-6 gap-2 flex flex-col">
              <NavigationMenuContainer menu={menu as StrapiMenu} />
              <div className="flex">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
