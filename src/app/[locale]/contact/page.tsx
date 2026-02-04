import Grid from "@/components/common/grid";
import { ContactBackground } from "@/components/contact/contact-background";
import { ContactMain } from "@/components/contact/contact-main";
import { DragProvider } from "@/contexts/drag-context";
import { getContact } from "@/services/strapi/contactService";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

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
  const contact = await getContact();
  console.log(contact);

  if (!contact) {
    notFound();
  }

  const backgroundImages = contact.backgroundImages;

  return (
    <DragProvider>
      <div className="bg-black relative min-h-[150dvh]">
        <ContactBackground images={backgroundImages} />
        <Grid>
          <ContactMain contact={contact} />
        </Grid>
      </div>
    </DragProvider>
  );
}
