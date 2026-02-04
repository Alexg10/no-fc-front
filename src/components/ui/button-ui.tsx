"use client";

import { Loader2 } from "lucide-react";

import { GlobeIcon } from "@/components/icons/globe-icon";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonUiVariants = cva(
  "flex items-center gap-4 border border-black p-2 !text-obviously uppercase group w-fit",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        secondary: "bg-white text-black border-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonUiVariants = VariantProps<typeof buttonUiVariants>;

interface ButtonUiProps {
  children: React.ReactNode;
  variant?: ButtonUiVariants["variant"];
  className?: string;
  loading?: boolean;
  hasIcon?: boolean;
  onClick?: () => void;
}
export function ButtonUi({
  children,
  variant = "default",
  hasIcon = true,
  className,
  loading = false,
  onClick,
}: ButtonUiProps) {
  return (
    <button
      type="button"
      className={cn(buttonUiVariants({ variant, className }))}
      onClick={onClick}
      disabled={loading}
    >
      <div
        className={cn(
          "flex items-center gap-2 border p-2 px-4",
          variant === "secondary"
            ? "border-black text-black"
            : "border-white text-white",
        )}
      >
        {hasIcon && <GlobeIcon className="w-5 h-5 lg:w-6 lg:h-6" />}
        <div className="-translate-y-px">{children}</div>
        {loading && (
          <Loader2 className="ml-2 size-5 animate-spin" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}
