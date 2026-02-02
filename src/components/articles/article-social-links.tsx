"use client";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { SendMailIcon } from "@/components/icons/send-mail-icon";
import { XIcon } from "@/components/icons/x-icon";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface ArticleSocialLinksProps {
  className?: string;
}

export function ArticleSocialLinks({ className }: ArticleSocialLinksProps) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <ul className={cn("flex ml-4 gap-4 overflow-hidden", className)}>
      <li>
        <Link href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}>
          <FacebookIcon />
        </Link>
      </li>
      <li>
        <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}>
          <LinkedinIcon />
        </Link>
      </li>
      <li>
        <Link href={`https://www.twitter.com/share?url=${currentUrl}`}>
          <XIcon />
        </Link>
      </li>
      <li>
        <SendMailIcon />
      </li>
    </ul>
  );
}
