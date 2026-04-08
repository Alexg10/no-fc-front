"use client";

import { PlayIcon } from "@/components/icons/play-icon";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { cn } from "@/lib/utils";
import Marquee from "react-fast-marquee";

interface PlayVideoButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  marqueeIsPlaying?: boolean;
  className?: string;
}

export function PlayVideoButton({
  onClick,
  ariaLabel = "Play video",
  marqueeIsPlaying = false,
  className,
}: PlayVideoButtonProps) {
  const isUnderTablet = useBreakpoints().isUnderTablet;
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-black cursor-pointer p-2 flex absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center text-2xl font-bold duration-300 max-w-[185px]",
        className,
      )}
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-center gap-4 border border-white w-full ">
        {isUnderTablet ? (
          <div className="flex items-center translate-x-0.5 size-8 justify-center heading-s-obviously lg:text-[24px]">
            <PlayIcon />
          </div>
        ) : (
          <Marquee
            className="text-white text-nowrap gap-3 -translate-y-0.5 py-2"
            play={marqueeIsPlaying}
          >
            <div className="flex items-center justify-center gap-2 heading-s-obviously lg:text-[16px] translate-y-px">
              <div>Play video</div>
              <PlayIcon className="size-[13px] translate-y-px" />
              <div>Play video</div>
              <PlayIcon className="size-[13px] translate-y-px" />
              <div>Play video</div>
              <PlayIcon className="size-[13px] translate-y-px" />
            </div>
          </Marquee>
        )}
      </div>
    </button>
  );
}
