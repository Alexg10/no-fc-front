import Grid from "@/components/common/grid";
import { getFooter } from "@/services/strapi/footerService";
import { getGeneral } from "@/services/strapi/generalService";
import { StrapiLink } from "@/types/strapi";
import { FooterBottom } from "./footer-bottom";
import { FooterNoFc } from "./footer-nofc";
import { FooterTop } from "./footer-top";

export async function Footer() {
  const footer = await getFooter();
  const general = await getGeneral();

  return (
    <footer className="border-t border-black bg-off-white py-4 lg:pt-10">
      <Grid>
        <div className="col-span-full">
          <FooterTop
            footerTopLinks={footer?.topLinks as StrapiLink[]}
            socialLinks={general?.socials as StrapiLink[]}
          />
        </div>
      </Grid>
      <hr className="border-black" />
      <Grid>
        <div className="col-span-full">
          <FooterBottom
            footerBottomLinks={footer?.bottomLinks as StrapiLink[]}
          />
        </div>
      </Grid>
      <FooterNoFc />
    </footer>
  );
}
