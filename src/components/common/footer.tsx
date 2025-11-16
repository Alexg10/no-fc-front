"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo et description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black dark:text-zinc-50">
              NOFC
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-black dark:text-zinc-50">
              {t("navigation")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("products")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-black dark:text-zinc-50">
              {t("support")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-black dark:text-zinc-50">
              {t("information")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("legal")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}

