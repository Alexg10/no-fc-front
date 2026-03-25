"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import Lottie from "react-lottie-player";
import EyeButtonLight from "../../../public/lotties/eye-button-light.json";
import EyeButton from "../../../public/lotties/eye-button.json";

const buttonLinkVariants = cva(
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

type ButtonLinkVariants = VariantProps<typeof buttonLinkVariants>;

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonLinkVariants["variant"];
  className?: string;
  loading?: boolean;
  hasIcon?: boolean;
}
export function ButtonLink({
  href,
  children,
  variant = "default",
  hasIcon = true,
  className,
  loading = false,
}: ButtonLinkProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      href={href}
      className={cn(buttonLinkVariants({ variant, className }))}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={cn(
          "flex items-center gap-2 border p-2 px-4",
          variant === "secondary" ? "border-black" : "border-white",
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
          </div>
          <div className="opacity-0">{children}</div>
        </div>
        {loading && (
          <Loader2 className="ml-2 size-5 animate-spin" aria-hidden="true" />
        )}
      </div>
    </Link>
  );
}
