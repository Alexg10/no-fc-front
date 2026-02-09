import { cn } from "@/lib/utils";

interface BurgerIconProps {
  isOpen: boolean;
}

export function BurgerIcon({ isOpen }: BurgerIconProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
      <span
        className={cn(
          "w-[23px] h-[4px] overflow-hidden transition duration-500 ease-in-out",
          isOpen
            ? "rotate-45 origin-left translate-x-1"
            : "rotate-0 origin-left translate-x-0",
        )}
      >
        <div className="burger-line w-[23px] h-[3px] bg-black translate-y-[6px]" />
      </span>
      <span className="w-[23px] h-[4px] overflow-hidden">
        <div
          className={cn(
            "burger-line w-[23px] h-[3px] bg-black translate-y-[6px] opacity-100 duration-500 ease-in-out transition-opacity",
            isOpen &&
              "-translate-y-[6px]! opacity-0 duration-300 ease-in-out transition-opacity",
          )}
        />
      </span>
      <span
        className={cn(
          "w-[23px] h-[4px] overflow-hidden transition duration-500 ease-in-out",
          isOpen
            ? "-rotate-45 origin-left translate-x-1"
            : "rotate-0 origin-left translate-x-0",
        )}
      >
        <div className="burger-line w-[23px] h-[3px] bg-black translate-y-[6px]" />
      </span>
    </div>
  );
}
