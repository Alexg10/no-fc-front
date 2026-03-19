"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface BackLinkProps {
  href: string;
  className?: string;
}

export function BackLink({ href, className }: BackLinkProps) {
  const t = useTranslations("common");
  return (
    <Link
      href={href}
      className={cn(
        "uppercase text-center text-xl-obviously pb-3 flex items-center justify-center lg:text-[16px]",
        className,
      )}
    >
      {t("back")}
    </Link>
  );
}
