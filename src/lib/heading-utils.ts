import React from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingMap = {
  1: "h1" as const,
  2: "h2" as const,
  3: "h3" as const,
  4: "h4" as const,
  5: "h5" as const,
  6: "h6" as const,
} as const;

export function createHeadingElement(
  level: HeadingLevel,
  props: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }
) {
  const HeadingTag = headingMap[level];
  return React.createElement(HeadingTag, props);
}
