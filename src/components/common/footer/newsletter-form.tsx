"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function NewsletterForm() {
  const t = useTranslations("footer");
  return (
    <div className="bg-white p-4 flex flex-col items-start gap-4 md:flex-row md:max-w-[60%] lg:col-span-5 lg:max-w-none">
      <div className="max-w-[76px] md:max-w-[147px]">
        <Image
          src="/images/footer/newsletter_image.webp"
          alt="Newsletter"
          width={147}
          height={202}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Title
            level={2}
            className="text-left text-[24px] lg:text-[40px] lg:max-w-[60%]"
          >
            {t("newsletterTitle")}
          </Title>
          <p className="text-left text-[16px]">{t("newsletterDescription")}</p>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            type="email"
            placeholder={t("newsletterPlaceholder")}
            className="w-full p-2 border border-black/10"
          />
          <Button variant="default">
            <div className="flex items-center gap-2 border border-white p-2 px-4">
              <div className="-translate-y-px">{t("newsletterButton")}</div>
            </div>
          </Button>
        </div>
        <p className="text-sm">
          {t.rich("newsletterAgreement", {
            termsLink: (chunks) => (
              <Link href="/terms" className="underline hover:no-underline">
                {chunks}
              </Link>
            ),
            privacyLink: (chunks) => (
              <Link href="/privacy" className="underline hover:no-underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
