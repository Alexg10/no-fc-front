import { ArticlesContent } from "@/components/articles/articles-content";
import Grid from "@/components/common/grid";
import { PageHeader } from "@/components/common/page-header";
import { PreFooterMarquee } from "@/components/common/pre-footer-marquee";
import { ArticlesLoading } from "@/components/skeleton/articles-loading";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

interface ArticlesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("articles.title"),
    description: t("articles.description"),
    openGraph: {
      title: t("articles.title"),
      description: t("articles.description"),
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/${locale}/articles`,
    },
  };
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "article" });
  return (
    <div className="bg-off-white overflow-hidden">
      <PageHeader title={t("articlesListPage.title")} marquee={"Stories"} />
      <Grid>
        <main className="col-span-full py-4 pb-10 lg:py-10 lg:pb-26">
          <Suspense fallback={<ArticlesLoading />}>
            <ArticlesContent locale={locale} />
          </Suspense>
        </main>
      </Grid>
      <PreFooterMarquee />
    </div>
  );
}
