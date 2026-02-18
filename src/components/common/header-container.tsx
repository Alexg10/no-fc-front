"use client";

import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeaderContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "/fr";
  const [isHidden, setIsHidden] = useState(false);

  useGSAP(
    () => {
      if (isHomepage) return;

      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setIsHidden(self.direction === 1);
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { dependencies: [pathname] },
  );

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
