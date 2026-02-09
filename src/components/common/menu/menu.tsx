"use client";

import { LanguageSwitcher } from "@/components/common/language-switcher";
import { NavigationMenuContainer } from "@/components/common/menu/navigation/navigation-menu";
import { LogoIcons } from "@/components/icons/logo-icons";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { StrapiMarquee } from "@/types/strapi";
import { StrapiMenu } from "@/types/strapi/menu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import LottiePlayer from "react-lottie-player";
import Tagline from "../../../../public/lotties/tagline.json";
import { BurgerIcon } from "./burger-icon";
import { MenuMarquee } from "./menu-marquee";

gsap.registerPlugin(ScrollTrigger);

export function Menu({
  menu,
  marquee,
}: {
  menu: StrapiMenu;
  marquee: StrapiMarquee;
}) {
  const isUnderDesktop = useBreakpoints().isUnderDesktop;
  const [isOpen, setIsOpen] = useState(isUnderDesktop ? false : true);
  const [isTaglinePlaying, setIsTaglinePlaying] = useState(false);
  const [isTaglineIsReversed, setIsTaglineIsReversed] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isInScrollZone, setIsInScrollZone] = useState(true);
  const burgerTimeline = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    burgerTimeline.current = gsap
      .timeline({
        paused: true,
      })
      .to(".burger-line", {
        y: 0,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: 0.1,
      });

    ScrollTrigger.create({
      trigger: "body",
      start: "top center",
      end: "+=125%",
      onLeave: () => {
        setIsOpen(false);
        setIsTaglineIsReversed(false);
        setIsTaglinePlaying(true);
        setIsInScrollZone(false);
        setMenuIsOpen(false);
        burgerTimeline.current?.play();
      },
      onEnterBack: () => {
        setIsOpen(true);
        setIsInScrollZone(true);
        burgerTimeline.current?.reverse();
        setTimeout(() => {
          setIsTaglineIsReversed(true);
          setIsTaglinePlaying(true);
        }, 500);
      },
    });
  });
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
            {menu.links && menu.links.length > 0 && (
              <NavigationMenuContainer
                menu={menu as StrapiMenu}
                onLinkClick={() => setIsOpen(false)}
              />
            )}
            <NavigationMenuContainer
              menu={menu as StrapiMenu}
              onLinkClick={() => setIsOpen(false)}
            />
            <div className="flex border-t border-black pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-0 flex left-0 flex-col h-full gap-4 z-[51]">
        <div className="flex flex-col gap-4 max-w-[108px] lg:max-w-[148px]">
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
                <LogoIcons isOpen={isOpen} />
              </Link>
              <button
                className="flex relative items-center p-2 size-25 lg:size-15 cursor-pointer justify-center"
                onClick={() => {
                  if (isInScrollZone) {
                    return;
                  } else {
                    setIsOpen(!isOpen);
                    setMenuIsOpen(!menuIsOpen);
                  }
                }}
              >
                <div className="scale-[1.06]">
                  <LottiePlayer
                    animationData={Tagline}
                    play={isTaglinePlaying}
                    direction={isTaglineIsReversed ? -1 : 1}
                    className="size-25"
                    loop={false}
                  />
                </div>
                <BurgerIcon isOpen={menuIsOpen} />
              </button>
            </div>
            {!isUnderDesktop && (
              <div
                className={cn(
                  "hidden top-full right-0 w-full lg:grid transition-all duration-700 cubic-bezier(0.23, 1, 0.36, 1)",
                  isOpen ? "grid-rows-[1fr] " : "grid-rows-[0fr] ",
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-2 pt-6 gap-2 flex flex-col pb-0">
                    {menu.links && menu.links.length > 0 && (
                      <NavigationMenuContainer
                        menu={menu as StrapiMenu}
                        onLinkClick={() => setIsOpen(false)}
                      />
                    )}
                    <div className="flex border-t border-black pt-4">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {marquee && marquee.label && (
            <MenuMarquee marquee={marquee} isOpen={isOpen} />
          )}
        </div>
      </div>
    </>
  );
}
