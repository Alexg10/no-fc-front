import { BackLink } from "@/components/common/back-link";
import Grid from "@/components/common/grid";
import { LogoIcons } from "@/components/icons/logo-icons";
import { BlocksContent } from "@strapi/blocks-react-renderer";
import Marquee from "react-fast-marquee";
import { BlockRendererClient } from "./block-renderer-client";

interface PageHeaderProps {
  title: BlocksContent;
  marquee?: string;
  backHref?: string;
}

export function PageHeader({ title, marquee, backHref }: PageHeaderProps) {
  return (
    <header className="bg-off-white text-black uppercase text-center ">
      <Grid className="px-4 pt-34 pb-6 lg:pt-6 lg:gap-y-10">
        {marquee && (
          <div className="hidden lg:flex col-span-full justify-center">
            <div className="border-2 border-black w-[170px] bg-white">
              <Marquee autoFill={true} className="text-nowrap py-[12px]">
                <h1 className="heading-s-obviously lg:text-[24px] mr-4">
                  {marquee}
                </h1>
                <LogoIcons className="w-6 h-6 mr-4" />
              </Marquee>
            </div>
          </div>
        )}
        <div className="col-span-full lg:col-start-4 lg:col-end-10">
          {backHref && <BackLink href={backHref} className="lg:hidden" />}
          <BlockRendererClient
            content={title as BlocksContent}
            className="[&>h1]:text-[64px]! [&>h2]:text-[64px]! [&>h3]:text-[64px]! [&>h4]:text-[64px]! [&>h5]:text-[64px]! [&>h6]:text-[64px]! [&>p]:text-[64px]! [&>h1]:heading-l-obviously! [&>h2]:heading-l-obviously! [&>h3]:heading-l-obviously! [&>h4]:heading-l-obviously! [&>h5]:heading-l-obviously! [&>h6]:heading-l-obviously! [&>p]:heading-l-obviously! [&>h1]:m-0! [&>h2]:m-0! [&>h3]:m-0! [&>h4]:m-0! [&>h5]:m-0! [&>h6]:m-0! [&>p]:m-0! text-center uppercase balance"
          />
        </div>
      </Grid>
    </header>
  );
}
