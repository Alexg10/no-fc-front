"use client";

import { createContext, ReactNode, useContext, useRef } from "react";

interface ArticleContextType {
  mainArticleRef: React.RefObject<HTMLDivElement>;
}

const ArticleContext = createContext<ArticleContextType | null>(null);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const mainArticleRef = useRef<HTMLDivElement>(null);

  return (
    <ArticleContext.Provider
      value={{
        mainArticleRef: mainArticleRef as React.RefObject<HTMLDivElement>,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticleRef() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticleRef must be used within ArticleProvider");
  }
  return context.mainArticleRef;
}
