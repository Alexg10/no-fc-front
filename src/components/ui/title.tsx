import { createHeadingElement } from "@/lib/heading-utils";
import { cn } from "@/lib/utils";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
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

export function Title({ children, className, level = 2, ...rest }: TitleProps) {
  return createHeadingElement(level, {
    className: cn(
      "heading-l-obviously text-center uppercase balance",
      className,
    ),
    ...rest,
    children: parseBreaks(children),
  });
}
