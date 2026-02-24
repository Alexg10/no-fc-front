"use client";

import Grid from "@/components/common/grid/grid";
import { PlayVideoButton } from "@/components/common/play-video-button";
import { getStrapiImageUrl } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import type { StrapiCommonVideoFullWidth } from "@/types/strapi";
import Image from "next/image";
import { useState } from "react";

interface VideoFullWidthBlockProps {
  block: StrapiCommonVideoFullWidth;
}

function getEmbedUrl(url: string): string {
  if (!url) return "";

  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&controls=1`;
    }
  }

  if (url.includes("youtube.com/embed/")) {
    const embedUrl = new URL(url);
    embedUrl.searchParams.set("autoplay", "1");
    return embedUrl.toString();
  }

  return url;
}

export function VideoFullWidthBlock({ block }: VideoFullWidthBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = getEmbedUrl(block.url || "");
  const [marqueeIsPlaying, setMarqueeIsPlaying] = useState(false);
  const handlePlayClick = () => {
    if (!embedUrl) {
      return;
    }
    setIsPlaying(true);
  };

  return (
    <section className="relative w-full py-4 m-0">
      <Grid>
        <div
          className="relative col-span-full w-full aspect-video bg-black overflow-hidden"
          onMouseEnter={() => setMarqueeIsPlaying(true)}
          onMouseLeave={() => setMarqueeIsPlaying(false)}
        >
          {embedUrl && isPlaying && (
            <iframe
              src={embedUrl}
              title={block.playerText || "Video player"}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!isPlaying && block.cover && (
            <button
              onClick={handlePlayClick}
              className={cn(
                "absolute inset-0 z-10 w-full h-full group",
                embedUrl ? "cursor-pointer" : "cursor-default",
              )}
              aria-label={block.playerText || "Play video"}
            >
              <Image
                src={getStrapiImageUrl(block.cover.url)}
                alt={block.cover.alternativeText || "Video cover"}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300 ",
                  embedUrl && "group-hover:opacity-80",
                )}
              />
            </button>
          )}

          {!isPlaying && embedUrl && (
            <PlayVideoButton
              onClick={handlePlayClick}
              ariaLabel={block.playerText || "Play video"}
              marqueeIsPlaying={marqueeIsPlaying}
            />
          )}
        </div>
      </Grid>
    </section>
  );
}
