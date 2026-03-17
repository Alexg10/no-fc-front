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
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import LottiePlayer from "react-lottie-player";
import Burger from "../../../../public/lotties/burger.json";
import { MenuMarquee } from "./menu-marquee";

gsap.registerPlugin(ScrollTrigger);

const FRAME_BURGER = 117;
const FRAME_CROSS = 155;

export function Menu({
  menu,
  marquee,
}: {
  menu: StrapiMenu;
  marquee: StrapiMarquee;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "/fr";
  const { isUnderDesktop } = useBreakpoints();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isInScrollZone, setIsInScrollZone] = useState(isHomepage);
  const burgerTimeline = useRef<GSAPTimeline>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lottieRef = useRef<any>(null);
  // Store current enterFrame listener so we can clean it up before starting a new one
  const activeListenerRef = useRef<(() => void) | null>(null);
  // Initial frame for mount — null once imperative control takes over
  const [initialGoTo] = useState(() => (isHomepage ? 0 : FRAME_BURGER));

  const clearActiveListener = useCallback(() => {
    const anim = lottieRef.current;
    if (anim && activeListenerRef.current) {
      anim.removeEventListener("enterFrame", activeListenerRef.current);
      activeListenerRef.current = null;
    }
  }, []);

  // Play forward to frame, then pause
  const playTo = useCallback(
    (frame: number) => {
      const anim = lottieRef.current;
      if (!anim) return;
      clearActiveListener();
      anim.setDirection(1);
      const onFrame = () => {
        if (anim.currentFrame >= frame - 1) {
          anim.pause();
          anim.removeEventListener("enterFrame", onFrame);
          activeListenerRef.current = null;
        }
      };
      activeListenerRef.current = onFrame;
      anim.addEventListener("enterFrame", onFrame);
      anim.play();
    },
    [clearActiveListener],
  );

  // Play reverse to frame, then pause
  const reverseTo = useCallback(
    (frame: number) => {
      const anim = lottieRef.current;
      if (!anim) return;
      clearActiveListener();
      anim.setDirection(-1);
      const onFrame = () => {
        if (anim.currentFrame <= frame + 1) {
          anim.pause();
          anim.removeEventListener("enterFrame", onFrame);
          activeListenerRef.current = null;
        }
      };
      activeListenerRef.current = onFrame;
      anim.addEventListener("enterFrame", onFrame);
      anim.play();
    },
    [clearActiveListener],
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reset menu state when navigating between homepage and other pages
  useEffect(() => {
    if (isHomepage) {
      setIsMenuVisible(!isUnderDesktop);
      setMenuIsOpen(false);
      setIsInScrollZone(true);
      burgerTimeline.current?.reverse();
    } else {
      setIsMenuVisible(false);
      setMenuIsOpen(false);
      setIsInScrollZone(false);
    }
  }, [isHomepage, isUnderDesktop]);

  useGSAP(
    () => {
      // Kill all existing ScrollTriggers to prevent stale triggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Only apply ScrollTrigger behavior on homepage
      if (isHomepage) {
        ScrollTrigger.create({
          trigger: "body",
          start: "top center",
          end: "+=125%",
          onLeave: () => {
            setIsMenuVisible(false);
            setIsInScrollZone(false);
            setMenuIsOpen(false);
            // Play lottie 0 → 70 (burger appears)
            playTo(FRAME_BURGER);
            burgerTimeline.current?.play();
          },
          onEnterBack: () => {
            setIsInScrollZone(true);
            // Reverse lottie → 0 (burger disappears)
            reverseTo(0);
            if (!isUnderDesktop) {
              setIsMenuVisible(true);
              burgerTimeline.current?.reverse();
            }
          },
        });
      } else {
        burgerTimeline.current?.play();
        // On non-homepage pages, jump directly to burger frame
        const anim = lottieRef.current;
        if (anim) {
          anim.goToAndStop(FRAME_BURGER, true);
        }
      }
    },
    { dependencies: [isUnderDesktop, pathname] },
  );
  return (
    <>
      {isUnderDesktop && (
        <div
          className={cn(
            "fixed top-0 left-0 flex-col h-fit w-full z-50 bg-white",
            isMenuVisible ? "translate-y-0" : "-translate-y-full",
            isMounted && "transition-all duration-500 ease-in-out",
          )}
        >
          <div className="p-6 pt-30 gap-2 flex flex-col">
            {menu.links && menu.links.length > 0 && (
              <NavigationMenuContainer
                menu={menu as StrapiMenu}
                onLinkClick={() => {
                  setIsMenuVisible(false);
                  setMenuIsOpen(false);
                  reverseTo(FRAME_BURGER);
                }}
              />
            )}
            <NavigationMenuContainer
              menu={menu as StrapiMenu}
              onLinkClick={() => {
                setIsMenuVisible(false);
                setMenuIsOpen(false);
                reverseTo(FRAME_BURGER);
              }}
            />
            <div className="flex border-t border-black pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-0 flex left-0 flex-col h-full gap-4 z-[51]">
        <div className="flex flex-col gap-2 max-w-[108px] lg:max-w-[148px]">
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
                <LogoIcons isOpen={isMenuVisible} />
              </Link>
              <button
                className="flex relative items-center p-2 size-11 lg:size-15 cursor-pointer justify-center"
                onClick={() => {
                  if (isHomepage && isInScrollZone && !isUnderDesktop) {
                    return;
                  }
                  const opening = !menuIsOpen;
                  setIsMenuVisible(opening);
                  setMenuIsOpen(opening);
                  if (opening) {
                    // Play lottie 70 → 155 (burger → cross)
                    playTo(FRAME_CROSS);
                  } else {
                    // Reverse lottie 155 → 70 (cross → burger)
                    reverseTo(FRAME_BURGER);
                  }
                }}
              >
                <div className="scale-[0.80] lg:scale-100">
                  <LottiePlayer
                    ref={lottieRef}
                    animationData={Burger}
                    play={false}
                    goTo={initialGoTo}
                    className="size-12"
                    loop={false}
                  />
                </div>
              </button>
            </div>
            {!isUnderDesktop && (
              <div
                className={cn(
                  "hidden top-full right-0 w-full lg:grid transition-all duration-700 cubic-bezier(0.23, 1, 0.36, 1)",
                  isMenuVisible ? "grid-rows-[1fr] " : "grid-rows-[0fr] ",
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-2 lg:px-0 pt-6 gap-2 flex flex-col pb-0">
                    {menu.links && menu.links.length > 0 && (
                      <NavigationMenuContainer
                        menu={menu as StrapiMenu}
                        onLinkClick={() => {
                          setIsMenuVisible(false);
                          setMenuIsOpen(false);
                          reverseTo(FRAME_BURGER);
                        }}
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
            <MenuMarquee marquee={marquee} isOpen={isMenuVisible} />
          )}
        </div>
      </div>
    </>
  );
}
