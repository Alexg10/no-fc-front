"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function HeaderContainerInner({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const isHomepage = pathname === "/" || pathname === "/fr";
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) >= 5) {
        setIsHidden(delta > 0 && currentScrollY > 100);
        lastScrollY.current = currentScrollY;
      }

      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (isHomepage) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isHomepage, handleScroll]);

  return (
    <div
      className={cn(
        "col-span-full flex relative items-center justify-between top-4",
        "transition-transform duration-500 ease-in-out",
        isHidden && "-translate-y-[200px]",
      )}
    >
      {children}
    </div>
  );
}

export function HeaderContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <HeaderContainerInner key={pathname} pathname={pathname}>
      {children}
    </HeaderContainerInner>
  );
}
