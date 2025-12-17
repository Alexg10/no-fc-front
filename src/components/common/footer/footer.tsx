import Grid from "@/components/common/grid";
import { getFooter } from "@/services/strapi/footerService";
import { StrapiLink } from "@/types/strapi";
import { FooterBottom } from "./footer-bottom";
import { FooterTop } from "./footer-top";

export async function Footer() {
  const footer = await getFooter();

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Grid>
        <div className="col-span-full">
          <FooterTop footerTopLinks={footer?.topLinks as StrapiLink[]} />
        </div>
      </Grid>
      <hr />
      <Grid>
        <div className="col-span-full">
          <FooterBottom
            footerBottomLinks={footer?.bottomLinks as StrapiLink[]}
          />
        </div>
      </Grid>
    </footer>
  );
}
