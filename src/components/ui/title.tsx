import { cn } from "@/lib/utils";
import { createHeadingElement } from "@/lib/heading-utils";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Title({ children, className, level = 2 }: TitleProps) {
  return createHeadingElement(level, {
    className: cn("heading-l-obviously text-center uppercase", className),
    children,
  });
}