"use client";

import { ArticleProvider } from "@/contexts/article-context";
import { ReactNode } from "react";

export function ArticlePageWrapper({ children }: { children: ReactNode }) {
  return <ArticleProvider>{children}</ArticleProvider>;
}
