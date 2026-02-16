import Grid from "@/components/common/grid";
import { LogoIcons } from "@/components/icons/logo-icons";
import { Title } from "@/components/ui/title";
import Marquee from "react-fast-marquee";

interface PageHeaderProps {
  title: string;
  marquee?: string;
}

export function PageHeader({ title, marquee }: PageHeaderProps) {
  return (
    <header className="bg-off-white text-black uppercase text-center ">
      <Grid className="px-4 pt-34 pb-6 lg:pt-6 lg:gap-y-10">
        {marquee && (
          <div className="hidden lg:flex col-span-full justify-center">
            <div className="border border-black w-[170px] bg-white">
              <Marquee autoFill={true} className="text-nowrap">
                <h1 className="heading-s-obviously lg:text-[24px] mr-4">
                  {marquee}
                </h1>
                <LogoIcons className="w-6 mr-4" />
              </Marquee>
            </div>
          </div>
        )}
        <div className="col-span-full lg:col-start-5 lg:col-end-9">
          <Title level={2} className="lg:text-[64px]">
            {title}
          </Title>
        </div>
      </Grid>
    </header>
  );
}
