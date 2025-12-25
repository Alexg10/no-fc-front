import { BlockRenderer } from "@/components/common/block-renderer";
import { BlockSkeleton } from "@/components/skeleton/block-skeleton";
import Grid from "@/components/common/grid";
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

  return (
    <section className="min-h-screen">
      <header className="bg-black text-white">
        <Grid>
          <div className="col-span-full">
            <h1 className="mb-8 text-4xl font-bold">{page.title}</h1>
          </div>
        </Grid>
      </header>

      <Grid>
        <main className="col-span-full">
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
