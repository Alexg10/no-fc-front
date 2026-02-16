import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  html: string;
  className?: string;
}

export function ProductDescription({
  html,
  className,
}: ProductDescriptionProps) {
  if (!html) return null;

  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        "[&>p]:text-s-polymath [&>p]:mb-4 text-[12px]",
        "[&>h1]:text-xl-polymath-display [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6",
        "[&>h2]:text-xl-polymath-display [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5",
        "[&>h3]:text-l-polymath-display [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-4",
        "[&>ul]:list-none [&>ul]:space-y-2 [&>ul]:mb-4 [&>ul]:ml-5",
        "[&>ul>li]:relative [&>ul>li]:mb-0 [&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:-left-[20px] [&>ul>li]:before:top-[6px] [&>ul>li]:before:size-[6px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-transparent [&>ul>li]:before:border-black [&>ul>li]:before:border-1",
        "[&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:mb-4 [&>ol]:ml-6",
        "[&>a]:underline [&>a]:decoration-1 hover:[&>a]:decoration-2",
        "[&>strong]:font-semibold",
        "[&>em]:italic",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
