import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className }: GridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid h-full w-full max-w-[1464px] grid-cols-4 gap-4 px-4 md:grid-cols-6 lg:grid-cols-12 lg:gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
