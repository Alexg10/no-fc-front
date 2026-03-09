"use client";

import { PlayIcon } from "@/components/icons/play-icon";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import Marquee from "react-fast-marquee";

interface PlayVideoButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  marqueeIsPlaying?: boolean;
}

export function PlayVideoButton({
  onClick,
  ariaLabel = "Play video",
  marqueeIsPlaying = false,
}: PlayVideoButtonProps) {
  const isUnderTablet = useBreakpoints().isUnderTablet;
  return (
    <button
      onClick={onClick}
      className="bg-black cursor-pointer p-2 flex absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-bold duration-300 max-w-[185px]"
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-center gap-4 border border-white w-full ">
        {isUnderTablet ? (
          <div className="flex items-center translate-x-0.5 size-8 justify-center heading-s-obviously lg:text-[24px]">
            <PlayIcon />
          </div>
        ) : (
          <Marquee
            className="text-white text-nowrap gap-4 -translate-y-0.5 py-2"
            play={marqueeIsPlaying}
          >
            <div className="flex items-center justify-center gap-4 heading-s-obviously lg:text-[24px]">
              <div>Play video</div>
              <PlayIcon />
              <div>Play video</div>
              <PlayIcon />
              <div>Play video</div>
              <PlayIcon />
            </div>
          </Marquee>
        )}
      </div>
    </button>
  );
}
