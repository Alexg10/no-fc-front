import { ArticlesContent } from "@/components/articles/articles-content";
import { PageHeader } from "@/components/common/page-header";
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

  return (
    <>
      <PageHeader title="A Cultural Take on Football." marqueeLabel="Stories" />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ArticlesLoading />}>
          <ArticlesContent locale={locale} />
        </Suspense>
      </main>
    </>
  );
}
