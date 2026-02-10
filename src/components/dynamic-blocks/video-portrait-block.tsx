"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import Grid from "@/components/common/grid/grid";
import { PlayVideoButton } from "@/components/common/play-video-button";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiCommonVideoPortrait } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { useRef, useState } from "react";

interface VideoPortraitBlockProps {
  block: StrapiCommonVideoPortrait;
}

export function VideoPortraitBlock({ block }: VideoPortraitBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [marqueeIsPlaying, setMarqueeIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative w-full">
      <Grid>
        <div className="col-span-full flex flex-col items-center gap-8">
          {block.title && (
            <div className="text-center heading-m-obviously">
              <BlockRendererClient
                content={block.title as BlocksContent}
                className="text-center heading-m-obviously *:text-[64px]! *:mb-0 *:leading-[82%] *:lg:text-[120px]!"
              />
            </div>
          )}

          <div
            className="relative aspect-[9/16] w-full max-w-md overflow-hidden"
            onMouseEnter={() => setMarqueeIsPlaying(true)}
            onMouseLeave={() => setMarqueeIsPlaying(false)}
          >
            {block.video && (
              <video
                ref={videoRef}
                src={getStrapiImageUrl(block.video.url)}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                loop
                controls={true}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            {!isPlaying && block.cover && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer group"
                aria-label="Play video"
              >
                <Image
                  src={getStrapiImageUrl(block.cover.url)}
                  alt={block.cover.alternativeText || "Video cover"}
                  fill
                  className="object-cover"
                />
              </button>
            )}
            {!isPlaying && block.video && (
              <PlayVideoButton
                onClick={handlePlayClick}
                ariaLabel="Play video"
                marqueeIsPlaying={marqueeIsPlaying}
              />
            )}
          </div>

          {block.bottomTitle && (
            <div className="text-center">
              <BlockRendererClient
                content={block.bottomTitle as BlocksContent}
                className="text-center heading-m-obviously *:text-[64px]! *:mb-0 *:leading-[82%] *:lg:text-[120px]!"
              />
            </div>
          )}
        </div>
      </Grid>
    </section>
  );
}
