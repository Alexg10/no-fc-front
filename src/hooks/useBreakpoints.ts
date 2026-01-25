import { useEffect, useState } from "react";

export const BREAKPOINTS = {
  MOBILE: 640, // sm
  TABLET: 768, // md
  DESKTOP: 1024, // lg
} as const;

interface Breakpoints {
  isMobile: boolean; // < 640px
  isTablet: boolean; // 640px - 768px
  isDesktop: boolean; // >= 1024px
  isUnderTablet: boolean; // < 768px
  isUnderDesktop: boolean; // < 1024px
}

export function useBreakpoints(): Breakpoints {
  const [isMounted, setIsMounted] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isUnderTablet: false,
    isUnderDesktop: false,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;

      setBreakpoints({
        isMobile: width < BREAKPOINTS.MOBILE,
        isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET,
        isDesktop: width >= BREAKPOINTS.DESKTOP,
        isUnderTablet: width < BREAKPOINTS.TABLET,
        isUnderDesktop: width < BREAKPOINTS.DESKTOP,
      });
    };

    updateBreakpoints();
    setIsMounted(true);

    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  if (!isMounted) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isUnderTablet: false,
      isUnderDesktop: false,
    };
  }

  return breakpoints;
}
