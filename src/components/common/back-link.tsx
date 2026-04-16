"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { useTranslations } from "next-intl";

interface BackLinkProps {
  href: string;
  className?: string;
}

export function BackLink({ href, className }: BackLinkProps) {
  const t = useTranslations("common");
  return (
    <ButtonLink href={href} className={className}>
      {t("back")}
    </ButtonLink>
  );
}
