import { BlockRendererClient } from "@/components/common/block-renderer-client";
import { StrapiShippingInfos } from "@/services/strapi/generalService";

interface ShippingInfoProps {
  shippingInfos: StrapiShippingInfos | null | undefined;
}

export function ShippingInfo({ shippingInfos }: ShippingInfoProps) {
  if (!shippingInfos) return null;
  return (
    <div className="flex flex-col gap-1 lg:pt-2">
      <h3 className="text-polymath-display tracking-normal lg:text-[14px] lg:mb-1">
        {shippingInfos.title}
      </h3>
      {shippingInfos.content && (
        <BlockRendererClient
          content={shippingInfos.content}
          className="[&>p]:text-s-polymath! [&>p]:text-[12px]! [&>p]:leading-[120%]!"
        />
      )}
    </div>
  );
}
