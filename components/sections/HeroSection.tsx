import { ArrowRight, Clock, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { siteConfig } from "@/src/config/siteConfig";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-8 pt-32 md:pt-36">
      <div className="absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-aqua/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-xs font-black text-aqua">
            {siteConfig.hero.eyebrow}
          </p>
          <h1 className="aqua-text text-balance text-5xl font-black leading-[0.96] sm:text-6xl md:text-7xl lg:text-8xl">
            {siteConfig.hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-white/66 md:text-lg">
            {siteConfig.hero.subheadline}
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-white/55">
            <Clock className="size-4 text-mint" />
            <span>{siteConfig.hero.validityLabel}:</span>
            <span className="text-white">{siteConfig.hero.validityValue}</span>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={siteConfig.cta.href} className="w-full sm:w-auto">
              <Zap className="size-4" />
              {siteConfig.cta.checkoutLabel}
            </ButtonLink>
            <ButtonLink
              href={siteConfig.cta.secondaryHref}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {siteConfig.cta.secondaryLabel}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

      </div>
    </section>
  );
}
