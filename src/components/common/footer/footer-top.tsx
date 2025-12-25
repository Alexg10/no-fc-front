"use client";

import { StrapiLink } from "@/types/strapi";
import { Newsletter } from "../newsletter/newsletter";
import { FooterTopLinks } from "./footer-top-links";

export function FooterTop({
  footerTopLinks,
}: {
  footerTopLinks: StrapiLink[];
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <Newsletter />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-6">
        <FooterTopLinks footerTopLinks={footerTopLinks} />
      </div>
    </div>
  );
}
