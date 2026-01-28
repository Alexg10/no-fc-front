import { cn } from "@/lib/utils";
import { createHeadingElement } from "@/lib/heading-utils";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

function parseBreaks(text: React.ReactNode): React.ReactNode {
  if (typeof text !== "string") return text;

  const parts = text.split(/<br\s*\/?>/gi);
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <br />}
    </span>
  ));
}

export function Title({ children, className, level = 2 }: TitleProps) {
  return createHeadingElement(level, {
    className: cn("heading-l-obviously text-center uppercase", className),
    children: parseBreaks(children),
  });
}