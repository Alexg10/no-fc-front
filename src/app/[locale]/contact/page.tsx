import Grid from "@/components/common/grid";
import { ContactForm } from "@/components/contact/contact-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("contact.title"),
    description: t("contact.description"),
    openGraph: {
      title: t("contact.title"),
      description: t("contact.description"),
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/${locale}/contact`,
    },
  };
}

export default async function ContactPage() {
  return (
    <div className="bg-off-white">
      <Grid>
        <main className="col-span-full pt-40 pb-40 lg:py-16 lg:pb-26 lg:col-start-4 lg:col-end-10">
          <ContactForm />
        </main>
      </Grid>
    </div>
  );
}
