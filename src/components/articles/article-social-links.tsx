"use client";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { SendMailIcon } from "@/components/icons/send-mail-icon";
import { XIcon } from "@/components/icons/x-icon";
import { blocksToPlainText } from "@/lib/blocks";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";

interface ArticleSocialLinksProps {
  className?: string;
  articleTitle?: string;
  articleDescription?: BlocksContent;
}

export function ArticleSocialLinks({
  className,
  articleTitle,
  articleDescription,
}: ArticleSocialLinksProps) {
  const t = useTranslations("article");
  const [currentUrl, setCurrentUrl] = useState("");
  const descriptionStr = blocksToPlainText(articleDescription);

  useEffect(() => {
    queueMicrotask(() => setCurrentUrl(window.location.href));
  }, []);

  return (
    <ul
      className={cn(
        "flex lg:pl-0 lg:ml-4 gap-3 lg:gap-4 overflow-hidden",
        className,
      )}
    >
      <li>
        <FacebookShareButton url={currentUrl}>
          <div className="p-4 pb-3 lg:p-0">
            <FacebookIcon />
          </div>
        </FacebookShareButton>
      </li>
      <li>
        <LinkedinShareButton url={currentUrl}>
          <div className="p-4 pb-3 lg:p-0">
            <LinkedinIcon />
          </div>
        </LinkedinShareButton>
      </li>
      <li>
        <TwitterShareButton url={currentUrl}>
          <div className="p-4 pb-3 lg:p-0">
            <XIcon />
          </div>
        </TwitterShareButton>
      </li>
      <li>
        <Link
          href={`mailto:?subject=${encodeURIComponent(
            articleTitle ?? "",
          )}&body=${encodeURIComponent(
            `${t("checkOutThisArticle")} ${currentUrl}\n\n${descriptionStr}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="p-4 pb-3 lg:p-0">
            <SendMailIcon />
          </div>
        </Link>
      </li>
    </ul>
  );
}
