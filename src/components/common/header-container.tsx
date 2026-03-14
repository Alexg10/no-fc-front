"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function HeaderContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "/fr";
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    if (isHomepage) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage, handleScroll]);

  return (
    <div
      className={cn(
        "col-span-full flex relative items-center justify-between top-4 lg:top-6",
        "transition-transform duration-500 ease-in-out",
        isHidden && "-translate-y-[200px]",
      )}
    >
      {children}
    </div>
  );
}
