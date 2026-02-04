"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Title } from "@/components/ui/title";
import { useDrag } from "@/contexts/drag-context";
import { StrapiContact } from "@/services/strapi/contactService";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { useCallback } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacy: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  privacy: false,
};

export function ContactForm({ contact }: { contact: StrapiContact }) {
  const t = useTranslations("contact");
  const { isDragging } = useDrag();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setFormData(INITIAL_FORM_DATA);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    },
    [formData]
  );

  const inputClassName =
    "w-full p-3 border border-black/10 disabled:opacity-50 focus:outline-none focus:border-black transition-all duration-300";

  return (
    <div className={`w-full bg-white p-4 max-w-[600px] mx-auto ${isDragging ? "pointer-events-none" : ""}`}>
      {status === "success" ? (
        <div className="p-6 bg-green-50 border border-green-200">
          <p className="text-green-700">{t("success")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 border border-black p-4 py-6">
          <Title
            level={2}
            className="heading-m-obviously text-left lg:text-[40px]"
          >
            {contact.title}
          </Title>
          <BlockRendererClient
            content={contact.description}
            className="text-l-polymath [&>p]:text-polymath max-w-[80%]"
          />
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                id="name"
                name="name"
                placeholder={t("form.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t("form.emailPlaceholder")}
                value={formData.email}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder={t("form.subjectPlaceholder")}
                value={formData.subject}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <textarea
                id="message"
                name="message"
                placeholder={t("form.messagePlaceholder")}
                value={formData.message}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                rows={6}
                className={inputClassName + " resize-none"}
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600">{t("error")}</p>
            )}
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                name="privacy"
                checked={formData.privacy}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    privacy: checked === true ? true : false,
                  }))
                }
                disabled={status === "loading"}
                required
              />
              <label htmlFor="privacy">
                <BlockRendererClient
                  content={contact.privacy}
                  className="text-[12px] -translate-y-[1px] [&>p]:text-[12px] max-w-[60%]"
                />
              </label>
            </div>

            <Button
              variant="default"
              type="submit"
              disabled={status === "loading"}
              className="self-start w-full"
            >
              <div className="flex items-center gap-2 border border-white p-2 px-6 w-full">
                <div className="-translate-y-px w-full">
                  {status === "loading" ? t("form.sending") : t("form.submit")}
                </div>
              </div>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
