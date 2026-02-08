import { useBreakpoints } from "@/hooks/useBreakpoints";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { StrapiMarquee } from "@/types/strapi";
import Marquee from "react-fast-marquee";

export function MenuMarquee({
  marquee,
  isOpen,
}: {
  marquee: StrapiMarquee;
  isOpen: boolean;
}) {
  const isUnderDesktop = useBreakpoints().isUnderDesktop;
  const content = (
    <>
      {marquee.link ? (
        <Link href={marquee.link}>
          <div className="py-4">{marquee.label}</div>
        </Link>
      ) : (
        <span className="py-4">{marquee.label}</span>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "bg-lime text-black text-nowrap overflow-hidden transition-opacity ease-in-out",
        isOpen && isUnderDesktop
          ? "opacity-0 pointer-events-none duration-300 "
          : "opacity-100 delay-[350ms] duration-500",
      )}
    >
      <Marquee
        autoFill={false}
        speed={30}
        className="text-nowrap text-obviously flex items-center text-[14px] lg:text-[18px] uppercase"
      >
        {content}
        <span className="mx-2" />
        {content}
        <span className="mx-2" />
        {content}
      </Marquee>
    </div>
  );
}
