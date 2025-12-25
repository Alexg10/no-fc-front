import { Link } from "@/lib/navigation";
import { StrapiLink } from "@/types/strapi";

export function FooterTopLinks({
  footerTopLinks,
}: {
  footerTopLinks: StrapiLink[];
}) {
  return (
    <>
      {footerTopLinks?.map((footerTopLink) => (
        <Link
          href={footerTopLink.link}
          target={footerTopLink.target}
          key={footerTopLink.id}
        >
          {footerTopLink.label}
        </Link>
      ))}
    </>
  );
}
