"use client";

import { LogoIcons } from "@/components/icons/logo-icons";
import { Link } from "@/lib/navigation";
import { StrapiLink } from "@/types/strapi";
import { useTranslations } from "next-intl";

export function FooterBottom({
  footerBottomLinks,
}: {
  footerBottomLinks: StrapiLink[];
}) {
  const t = useTranslations("footer");
  return (
    <div className="py-6 flex justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <LogoIcons />
        <p className="text-sm text-gray-500 flex flex-col">
          <span>
            &copy; {new Date().getFullYear()} {t("copyright")}
          </span>
          <span className="text-gray-500">{t("allRightsReserved")}</span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {footerBottomLinks?.map((footerBottomLink) => (
          <Link
            href={footerBottomLink.link}
            target={footerBottomLink.target}
            key={footerBottomLink.id}
          >
            {footerBottomLink.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
