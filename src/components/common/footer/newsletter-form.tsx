"use client";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "alreadySubscribed" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus(data.alreadySubscribed ? "alreadySubscribed" : "success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
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
        {(status === "idle" || status === "loading" || status === "error") && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:flex-row"
          >
            <input
              type="email"
              placeholder={t("newsletterPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              aria-invalid={status === "error"}
              className="w-full p-2 border border-black disabled:opacity-50"
            />
            <Button
              variant="default"
              type="submit"
              disabled={status === "loading"}
            >
              <div className="flex items-center gap-2 border border-white p-2 px-4">
                <div className="-translate-y-px">
                  {status === "loading"
                    ? t("newsletterLoading")
                    : t("newsletterButton")}
                </div>
              </div>
            </Button>
          </form>
        )}
        {status === "success" && (
          <p className="text-sm text-green-600">{t("newsletterSuccess")}</p>
        )}
        {status === "alreadySubscribed" && (
          <p className="text-sm text-green-600">
            {t("newsletterAlreadySubscribed")}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">{t("newsletterError")}</p>
        )}
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
