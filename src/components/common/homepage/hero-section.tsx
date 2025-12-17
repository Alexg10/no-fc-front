import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { getStrapiImageUrl } from "@/lib/strapi";
import { StrapiHomepageHero } from "@/types/strapi/homepage";
import Image from "next/image";

interface HeroSectionProps {
  hero: StrapiHomepageHero;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {hero.title && (
              <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
                {hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 sm:text-3xl">
                {hero.subtitle}
              </h2>
            )}
            {hero.description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
                {hero.description}
              </p>
            )}
            {hero.button && hero.button.link && (
              <div className="flex justify-center lg:justify-start gap-4 pt-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href={hero.button.link}>{hero.button.label}</Link>
                </Button>
              </div>
            )}
          </div>
          {hero.background?.url && (
            <div className="relative aspect-square w-full max-w-2xl mx-auto lg:mx-0">
              <Image
                src={getStrapiImageUrl(hero.background.url)}
                alt={hero.background.alternativeText || hero.title}
                fill
                className="object-cover rounded-lg"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={process.env.NODE_ENV === "development"}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
