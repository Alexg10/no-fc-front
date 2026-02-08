import { BlockRenderer } from "@/components/common/block-renderer";
import Grid from "@/components/common/grid";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import { getPageBySlug } from "@/services/strapi/pageService";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "pages" });

  if (!page) {
    return {
      title: t("notFound.title"),
      description: t("notFound.description"),
    };
  }

  return {
    title: page.title,
    openGraph: {
      title: page.title,
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }
  console.log(page);

  return (
    <section className="min-h-screen bg-off-white">
      <header className="bg-black text-white pt-48 pb-6 overflow-hidden lg:min-h-[300px] lg:relative">
        <Grid>
          <div className="col-span-full lg:col-start-4 lg:col-end-10 overflow-hidden ">
            <div className="lg:absolute lg:-top-12 lg:flex lg:flex-col">
              <h1 className="heading-l-obviously leading-[95%]">
                {page.title}
              </h1>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
              <span className="hidden lg:flex heading-l-obviously leading-[95%]">
                {page.title}
              </span>
            </div>
          </div>
        </Grid>
      </header>

      <Grid>
        <main className="col-span-full pt-10 pb-16 lg:col-start-4 lg:col-end-10 lg:pb-30">
          {page.blocks && page.blocks.length > 0 && (
            <div>
              {page.blocks.map((block, index) => (
                <Suspense
                  key={`${block.__component}-${index}`}
                  fallback={<BlockSkeleton />}
                >
                  <BlockRenderer block={block} locale={locale} />
                </Suspense>
              ))}
            </div>
          )}
        </main>
      </Grid>
    </section>
  );
}
