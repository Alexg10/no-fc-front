"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// locale → absolute path (e.g. { en: "/en/articles/my-article", fr: "/articles/mon-article" })
type AlternateLinks = Record<string, string>;

interface AlternateLinksContextType {
  alternateLinks: AlternateLinks;
  setAlternateLinks: (links: AlternateLinks) => void;
}

const AlternateLinksContext = createContext<AlternateLinksContextType>({
  alternateLinks: {},
  setAlternateLinks: () => {},
});

export function AlternateLinksProvider({ children }: { children: ReactNode }) {
  const [alternateLinks, setAlternateLinks] = useState<AlternateLinks>({});

  return (
    <AlternateLinksContext.Provider value={{ alternateLinks, setAlternateLinks }}>
      {children}
    </AlternateLinksContext.Provider>
  );
}

export function useAlternateLinks() {
  return useContext(AlternateLinksContext);
}
