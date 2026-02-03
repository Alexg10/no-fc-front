import { Link } from "@/lib/navigation";
import { StrapiMarquee } from "@/types/strapi";
import Marquee from "react-fast-marquee";

export function MenuMarquee({ marquee }: { marquee: StrapiMarquee }) {
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
    <div className="bg-lime text-black text-nowrap overflow-hidden">
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
