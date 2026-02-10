"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";
import Lottie from "react-lottie-player";
import EyeButton from "../../../public/lotties/eye-button.json";

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
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      type="button"
      className={cn(buttonUiVariants({ variant, className }))}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={cn(
          "flex items-center gap-2 border p-2 px-4",
          variant === "secondary"
            ? "border-black text-black"
            : "border-white text-white",
        )}
      >
        {hasIcon && (
          <span className="size-5 bg-black">
            <Lottie
              animationData={EyeButton}
              loop
              play={isHover}
              className=""
            />
          </span>
        )}
        <div className="-translate-y-px">{children}</div>
        {loading && (
          <Loader2 className="ml-2 size-5 animate-spin" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}
