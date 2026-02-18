"use client";

import { useAlternateLinks } from "@/contexts/alternate-links-context";
import { useEffect } from "react";

interface AlternateLinksUpdaterProps {
  links: Record<string, string>; // locale → absolute path
}

export function AlternateLinksUpdater({ links }: AlternateLinksUpdaterProps) {
  const { setAlternateLinks } = useAlternateLinks();

  const linksKey = JSON.stringify(links);
  useEffect(() => {
    setAlternateLinks(links);
    return () => setAlternateLinks({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linksKey]);

  return null;
}
