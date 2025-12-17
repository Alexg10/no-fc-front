import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className }: GridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid h-full w-full max-w-[1168px] grid-cols-5 gap-5 px-6 md:grid-cols-6 lg:grid-cols-12 lg:gap-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
