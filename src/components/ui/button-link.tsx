"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";

import { GlobeIcon } from "@/components/icons/globe-icon";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonLinkVariants = cva(
  "flex items-center gap-4 border border-black p-2 !text-obviously uppercase group w-fit",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
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
  return (
    <Link
      href={href}
      className={cn(buttonLinkVariants({ variant, className }))}
    >
      <div className="flex items-center gap-2 border border-white p-2 px-4">
        {hasIcon && <GlobeIcon className="w-5 h-5 lg:w-6 lg:h-6" />}
        <div className="-translate-y-px">{children}</div>
        {loading && (
          <Loader2 className="ml-2 size-5 animate-spin" aria-hidden="true" />
        )}
      </div>
    </Link>
  );
}
