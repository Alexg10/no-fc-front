"use client";

import { LanguageSwitcher } from "@/components/common/language-switcher";
import { NavigationMenuContainer } from "@/components/common/menu/navigation/navigation-menu";
import { LogoIcons } from "@/components/icons/logo-icons";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { StrapiMarquee } from "@/types/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import { useState } from "react";
import { MenuMarquee } from "./menu-marquee";

export function Menu({
  menu,
  marquee,
}: {
  menu: StrapiMenu;
  marquee: StrapiMarquee;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isUnderDesktop = useBreakpoints().isUnderDesktop;
  return (
    <>
      {isUnderDesktop && (
        <div
          className={cn(
            "fixed top-0 left-0 flex-col h-fit w-full z-50 bg-white",
            isOpen ? "translate-y-0" : "-translate-y-full",
            "transition-all duration-500 ease-in-out",
          )}
        >
          <div className="p-6 pt-30 gap-2 flex flex-col">
            <NavigationMenuContainer menu={menu as StrapiMenu} />
            <div className="flex">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-0 flex left-0 flex-col h-full gap-4 z-[51]">
        <div className="flex flex-col gap-4 max-w-[103px] lg:max-w-[148px]">
          <div className="relative bg-white p-2 lg:p-3 ">
            <div
              className={cn(
                "border-2 relative border-black flex items-center w-fit",
                "[&:after]:content-[''] [&:after]:w-[2px] [&:after]:h-full [&:after]:bg-black [&:after]:absolute [&:after]:top-0 [&:after]:right-1/2 [&:after]:translate-x-1/2",
              )}
            >
              <Link
                href="/"
                className="flex items-center p-2 size-11 lg:size-15"
              >
                <LogoIcons />
              </Link>
              <button
                className="flex items-center p-2 size-11 lg:size-15 cursor-pointer justify-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  width="17"
                  height="8"
                  viewBox="0 0 17 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="16.353" height="1.36275" fill="black" />
                  <rect
                    y="2.99805"
                    width="16.353"
                    height="1.36275"
                    fill="black"
                  />
                  <rect
                    y="5.99609"
                    width="16.353"
                    height="1.36275"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
            {!isUnderDesktop && (
              <div
                className={cn(
                  "hidden top-full right-0 w-full lg:grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr] ",
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-2 pt-6 gap-2 flex flex-col pb-0">
                    <NavigationMenuContainer menu={menu as StrapiMenu} />
                    <div className="flex border-t border-black pt-4">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {marquee && marquee.label && <MenuMarquee marquee={marquee} />}
        </div>
      </div>
    </>
  );
}
