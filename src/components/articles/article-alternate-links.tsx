import { AlternateLinksUpdater } from "@/components/common/alternate-links-updater";
import { routing } from "@/routing";

interface ArticleAlternateLinksProps {
  currentSlug: string;
  currentLocale: string;
  localizations: Array<{ slug: string; locale: string }>;
}

function articlePath(locale: string, slug: string): string {
  const prefix =
    locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}/articles/${slug}`;
}

export function ArticleAlternateLinks({
  currentSlug,
  currentLocale,
  localizations,
}: ArticleAlternateLinksProps) {
  const links: Record<string, string> = {
    [currentLocale]: articlePath(currentLocale, currentSlug),
  };

  for (const loc of localizations) {
    links[loc.locale] = articlePath(loc.locale, loc.slug);
  }

  return <AlternateLinksUpdater links={links} />;
}
