"use client";

import { useArticleRef } from "@/contexts/article-context";
import { ReactNode } from "react";

export function ArticleMainContent({ children }: { children: ReactNode }) {
  const mainRef = useArticleRef();
  return (
    <main className="relative" ref={mainRef}>
      {children}
    </main>
  );
}
