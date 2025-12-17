import Grid from "@/components/common/grid";

export function FooterNoFc() {
  return (
    <div className="py-6 flex justify-between items-center gap-6 bg-black text-white">
      <Grid>
        <div className="col-span-full text-xxl font-bold">
          <p>No Football Colors</p>
        </div>
      </Grid>
    </div>
  );
}
