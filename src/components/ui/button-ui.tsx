"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import Lottie from "react-lottie-player";
import EyeButtonLight from "../../../public/lotties/eye-button-light.json";
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
  marquee?: boolean;
}
export function ButtonUi({
  children,
  variant = "default",
  hasIcon = true,
  className,
  loading = false,
  onClick,
  marquee = true,
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
          "flex items-center gap-2 border p-2 px-4 cursor-pointer",
          variant === "secondary"
            ? "border-black text-black"
            : "border-white text-white",
        )}
      >
        {hasIcon && (
          <span className="size-5 bg-black">
            <Lottie
              animationData={
                variant === "secondary" ? EyeButtonLight : EyeButton
              }
              loop
              play={isHover}
              className=""
            />
          </span>
        )}
        <div className="-translate-y-px relative">
          <div className="w-full absolute top-0 left-0">
            {marquee ? (
              <Marquee
                play={isHover}
                speed={35}
                gradient={false}
                className="text-nowrap overflow-hidden"
              >
                <span className="mr-4">{children}</span>
                <span className="mr-4" aria-hidden>
                  {children}
                </span>
              </Marquee>
            ) : (
              <span className="text-nowrap overflow-hidden w-full">
                {children}
              </span>
            )}
          </div>
          <div className="opacity-0">{children}</div>
        </div>
        {loading && (
          <Loader2 className="ml-2 size-5 animate-spin" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}
