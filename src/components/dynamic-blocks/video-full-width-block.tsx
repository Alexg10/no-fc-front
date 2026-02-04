"use client";

import { PlayIcon } from "@/components/icons/play-icon";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiCommonVideoFullWidth } from "@/types/strapi";
import Image from "next/image";
import { useMemo, useState } from "react";
import Marquee from "react-fast-marquee";

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
  const [marqueePlaying, setMarqueePlaying] = useState(false);
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const embedUrl = getEmbedUrl(block.url || "");

  const marqueeContent = useMemo(
    () => (
      <Marquee
        className="text-white text-nowrap gap-4"
        play={marqueePlaying}
      >
        <div className="flex items-center justify-center gap-4 heading-s-obviously lg:text-[24px]">
          <div className="">Play video</div>
          <PlayIcon />
          <div className="">Play video</div>
          <PlayIcon />
          <div className="">Play video</div>
          <PlayIcon />
        </div>
      </Marquee>
    ),
    [marqueePlaying],
  );

  return (
    <section className="relative w-full p-4">
      <div
        className="relative w-full aspect-video bg-black overflow-hidden"
        onMouseEnter={() => setMarqueePlaying(true)}
        onMouseLeave={() => setMarqueePlaying(false)}
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
            className="absolute inset-0 z-10 w-full h-full cursor-pointer group"
            aria-label={block.playerText || "Play video"}
          >
            <Image
              src={getStrapiImageUrl(block.cover.url)}
              alt={block.cover.alternativeText || "Video cover"}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
          </button>
        )}

        {!isPlaying && (
          <button
            onClick={handlePlayClick}
            className="bg-black hover:bg-black/80 p-2 flex absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-bold transition-opacity duration-300 max-w-[185px]"
            aria-label={block.playerText || "Play video"}
          >
            <div className="flex items-center justify-center gap-4 border border-white w-full py-2">
              {marqueeContent}
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
