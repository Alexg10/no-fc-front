import Grid from "@/components/common/grid";
import { NoFcSloganIcon } from "@/components/icons/nofc-slogan-icon";

export function FooterNoFc() {
  return (
    <div className="py-10 overflow-hidden md:pt-20 lg:pt-30 pb-0 flex justify-between items-center gap-6 bg-white border-t border-black">
      <Grid>
        <div className="col-span-full text-xxl font-bold flex">
          <NoFcSloganIcon className="w-full max-w-[1182px]" />
        </div>
      </Grid>
    </div>
  );
}
