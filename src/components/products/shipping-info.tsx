import { Link } from "@/lib/navigation";

export function ShippingInfo() {
  return (
    <div className="flex flex-col gap-1 lg:pt-2">
      <p className="text-polymath-display tracking-normal lg:text-[14px] lg:mb-1">
        Livraison & retours
      </p>
      <p className="text-s-polymath text-[12px] leading-[120%]">
        Nous livrons partout dans le monde ! Compter en moyenne 3/5 jours ouvrés
        pour recevoir votre colis en France métropolitaine, et en moyenne 10
        jours ouvrés pour recevoir votre colis dans les autres pays.
      </p>
      <p className="text-s-polymath text-[12px]">
        Nous acceptons les retours, échanges et remboursements.
      </p>
      <Link
        href="/pages/livraison-et-retours"
        className="text-s-polymath text-[12px] underline"
      >
        Voir les conditions
      </Link>
    </div>
  );
}
