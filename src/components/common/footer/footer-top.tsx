"use client";

import { NewsletterForm } from "@/components/common/footer/newsletter-form";
import { Link } from "@/lib/navigation";
import { StrapiLink } from "@/types/strapi";

export function FooterTop({
  footerTopLinks,
  socialLinks,
}: {
  footerTopLinks: StrapiLink[];
  socialLinks: StrapiLink[];
}) {
  return (
    <div className="flex flex-col gap-10 pb-10 md:flex-row lg:grid-cols-12 lg:grid lg:gap-6 lg:pb-30">
      <NewsletterForm />
      <div className="flex flex-col gap-10 md:flex-row md:justify-between md:flex-1 lg:col-span-6 lg:col-start-7 lg:gap-8">
        <div className="flex flex-col gap-4 lg:flex-1">
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
        <div className="flex flex-col gap-4 lg:flex-1">
          {socialLinks?.map((socialLink) => (
            <Link
              href={socialLink.link}
              target={socialLink.target}
              key={socialLink.id}
            >
              {socialLink.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
