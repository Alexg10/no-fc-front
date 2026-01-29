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
    <div className="relative py-6 flex flex-col md:flex-row gap-4 md:items-center md:gap-6">
      <div className="flex gap-4 flex-col mb-6 md:mb-0">
        <LogoIcons className="size-10 md:size-18" />
      </div>
      <div className="flex flex-col gap-4 md:order-3 md:flex-row md:absolute md:right-0 md:gap-6">
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
      <div className="flex md:flex-col gap-1 md:order-2 md:gap-0 text-[16px]">
        <span>
          &copy; {new Date().getFullYear()} {t("copyright")}
        </span>
        <span className="">{t("allRightsReserved")}</span>
      </div>
    </div>
  );
}
