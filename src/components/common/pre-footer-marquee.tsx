import { LogoIcons } from "@/components/icons/logo-icons";
import { getGeneral } from "@/services/strapi/generalService";
import Marquee from "react-fast-marquee";

export async function PreFooterMarquee() {
  const general = await getGeneral();
  const bottomMarquee = general?.bottomMarquee;
  return (
    <Marquee autoFill={true} className="bg-black text-white text-nowrap">
      <div className="flex items-center justify-center gap-4 heading-s-obviously lg:text-[24px] mr-4">
        <div className="">{bottomMarquee?.firstText}</div>
        <LogoIcons className="w-6" />
        {bottomMarquee?.secondText && (
          <>
            <div className="">{bottomMarquee?.secondText}</div>
            <LogoIcons className="w-6" />
          </>
        )}
      </div>
    </Marquee>
  );
}
