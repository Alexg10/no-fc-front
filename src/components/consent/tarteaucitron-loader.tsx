"use client";

import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

let vercelServicePatchApplied = false;

declare global {
  interface Window {
    tarteaucitron?: {
      user: Record<string, string | undefined>;
      addInternalScript: (
        url: string,
        id: string,
        callback?: () => void,
        execute?: boolean,
        attrName?: string,
        attrVal?: string,
      ) => void;
      init: (params: Record<string, unknown>) => void;
      services: Record<
        string,
        {
          key: string;
          type: string;
          name: string;
          uri: string;
          needConsent: boolean;
          cookies: string[];
          js: () => void;
        }
      >;
      job: string[];
      state: Record<string, boolean>;
    };
    tarteaucitronForceLanguage?: string;
  }
}

function patchTarteaucitronForVercelService() {
  if (vercelServicePatchApplied) {
    return;
  }
  const tac = window.tarteaucitron;
  if (!tac) return;

  vercelServicePatchApplied = true;
  const orig = tac.addInternalScript.bind(tac);
  tac.addInternalScript = function (
    url: string,
    id: string,
    callback?: () => void,
    execute?: boolean,
    attrName?: string,
    attrVal?: string,
  ) {
    if (typeof url === "string" && url.includes("tarteaucitron.services")) {
      return orig(
        url,
        id,
        function () {
          tac.services.vercelanalytics = {
            key: "vercelanalytics",
            type: "analytic",
            name: "Vercel Analytics & Speed Insights",
            uri: "https://vercel.com/docs/analytics/privacy-policy",
            needConsent: true,
            cookies: [],
            js: function () {
              window.dispatchEvent(new Event("tac_vercel_allowed"));
            },
          };
          tac.job = tac.job || [];
          tac.job.push("vercelanalytics");
          if (GA_MEASUREMENT_ID) {
            tac.user.gtagUa = GA_MEASUREMENT_ID;
            if (!tac.job.includes("gtag")) {
              tac.job.push("gtag");
            }
          }
          if (typeof callback === "function") {
            callback();
          }
        },
        execute,
        attrName,
        attrVal,
      );
    }
    return orig(url, id, callback, execute, attrName, attrVal);
  };
}

function initTarteaucitron(privacyUrl: string) {
  window.tarteaucitron?.init?.({
    privacyUrl,
    bodyPosition: "top",
    hashtag: "#tarteaucitron",
    cookieName: "tarteaucitron",
    orientation: "bottom",
    groupServices: true,
    showDetailsOnClick: true,
    serviceDefaultState: "wait",
    showAlertSmall: false,
    cookieslist: true,
    cookieslistEmbed: false,
    closePopup: true,
    showIcon: true,
    iconPosition: "BottomRight",
    adblocker: false,
    DenyAllCta: true,
    AcceptAllCta: true,
    highPrivacy: true,
    alwaysNeedConsent: false,
    handleBrowserDNTRequest: false,
    removeCredit: true,
    moreInfoLink: true,
    useExternalCss: false,
    useExternalJs: false,
    mandatory: true,
    mandatoryCta: false,
    googleConsentMode: Boolean(GA_MEASUREMENT_ID),
    bingConsentMode: false,
    pianoConsentMode: false,
    softConsentMode: false,
    dataLayer: false,
    serverSide: false,
    partnersList: true,
  });
}

export function ConsentAwareVercel({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  const sync = useCallback(() => {
    const tac = window.tarteaucitron;
    if (tac?.state?.vercelanalytics === true) {
      setAllowed(true);
      return;
    }
    setAllowed(false);
  }, []);

  useEffect(() => {
    const runSync = () => queueMicrotask(() => sync());
    runSync();
    document.addEventListener("tac.consent_updated", runSync);
    window.addEventListener("tac_vercel_allowed", runSync);
    window.addEventListener("tac.root_available", runSync);
    return () => {
      document.removeEventListener("tac.consent_updated", runSync);
      window.removeEventListener("tac_vercel_allowed", runSync);
      window.removeEventListener("tac.root_available", runSync);
    };
  }, [sync]);

  if (!allowed) {
    return null;
  }
  return <>{children}</>;
}

export function TarteaucitronLoader({ privacyUrl }: { privacyUrl: string }) {
  useEffect(() => {
    const src = "/tarteaucitron/tarteaucitron.min.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );

    const bootstrap = () => {
      patchTarteaucitronForVercelService();
      initTarteaucitron(privacyUrl);
    };

    if (existing) {
      if (window.tarteaucitron) {
        bootstrap();
      } else {
        existing.addEventListener("load", bootstrap, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = bootstrap;
    document.head.appendChild(script);
  }, [privacyUrl]);

  return null;
}
