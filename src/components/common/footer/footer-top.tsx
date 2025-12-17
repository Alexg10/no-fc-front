"use client";

import { Link } from "@/lib/navigation";
import { StrapiLink } from "@/types/strapi";

export function FooterTop({
  footerTopLinks,
}: {
  footerTopLinks: StrapiLink[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {footerTopLinks?.map((footerTopLink) => (
          <Link
            href={footerTopLink.link}
            target={footerTopLink.target}
            key={footerTopLink.id}
          >
            {footerTopLink.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
