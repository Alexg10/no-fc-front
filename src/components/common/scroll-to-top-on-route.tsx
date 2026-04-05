"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.scrollingElement?.scrollTo(0, 0);
}

/**
 * Remonte la fenêtre en haut à chaque navigation client (chemin ou query).
 * Doit être rendu **après** le contenu de page dans le layout pour que ce
 * `useLayoutEffect` s’exécute après les effets des enfants (sinon un enfant
 * peut réappliquer une position de scroll après nous).
 */
export function ScrollToTopOnRoute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname, search]);

  useEffect(() => {
    scrollToTop();
    const id = requestAnimationFrame(() => {
      scrollToTop();
      requestAnimationFrame(scrollToTop);
    });
    const t = window.setTimeout(scrollToTop, 0);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [pathname, search]);

  return null;
}
