import Grid from "@/components/common/grid";
import { ContactForm } from "@/components/contact/contact-form";
import { getStrapiImageUrl } from "@/lib/strapi";
import { getContact } from "@/services/strapi/contactService";
import { StrapiImage } from "@/types/strapi";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
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

function generateRandomImages(images: StrapiImage[]) {
  const duplicatedImages = [...images, ...images];
  const positions = [];

  for (let i = 0; i < duplicatedImages.length; i++) {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomRotation = Math.random() * 40 - 20;

    positions.push({
      id: `${duplicatedImages[i].id}-${i}`,
      image: duplicatedImages[i],
      x: randomX,
      y: randomY,
      rotation: randomRotation,
    });
  }

  return positions;
}

export default async function ContactPage() {
  const contact = await getContact();
  console.log(contact);

  if (!contact) {
    notFound();
  }

  const backgroundImages = contact.backgroundImages;
  const randomPositions = generateRandomImages(backgroundImages);

  return (
    <div className="bg-black relative min-h-[150dvh]">
      <div className="bg-image-wrapper absolute inset-0 overflow-hidden">
        {randomPositions.map((item) => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            }}
          >
            <Image
              src={getStrapiImageUrl(item.image.url)}
              alt={item.image.alternativeText || ""}
              width={item.image.width}
              height={item.image.height}
              className="pointer-events-none"
              style={{
                maxWidth: "400px",
                height: "auto",
              }}
            />
          </div>
        ))}
      </div>
      <Grid>
        <main className="relative z-10 col-span-full pt-40 pb-40 lg:py-16 lg:pb-26 lg:col-start-4 lg:col-end-10">
          <ContactForm contact={contact} />
        </main>
      </Grid>
    </div>
  );
}
