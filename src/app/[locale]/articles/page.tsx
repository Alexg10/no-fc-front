import { ArticlesContent } from "@/components/articles/articles-content";
import Grid from "@/components/common/grid";
import { PageHeader } from "@/components/common/page-header";
import { LogoIcons } from "@/components/icons/logo-icons";
import { ArticlesLoading } from "@/components/skeleton/articles-loading";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Marquee from "react-fast-marquee";

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
    <div className="bg-off-white">
      <PageHeader title="A Cultural Take on Football." marquee={"Stories"} />
      <Grid>
        <main className="col-span-full py-4 pb-10 lg:py-10 lg:pb-26">
          <Suspense fallback={<ArticlesLoading />}>
            <ArticlesContent locale={locale} />
          </Suspense>
        </main>
      </Grid>
      <Marquee
        autoFill={true}
        className="bg-black text-white text-nowrap gap-4"
      >
        <div className="flex items-center justify-center gap-4 heading-s-obviously lg:text-[24px] ">
          <div className="">Free shipping on all eligible orders</div>
          <LogoIcons className="w-6" />
          <div className="">Refund guaranteed within 15 days</div>
          <LogoIcons className="w-6" />
        </div>
      </Marquee>
    </div>
  );
}
