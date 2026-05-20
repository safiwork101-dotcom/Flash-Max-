import { Zap } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { siteConfig } from "@/src/config/siteConfig";

export function FinalCta() {
  return (
    <section className="pb-24 pt-10">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-lg border border-aqua/20 bg-aqua/[0.055] px-6 py-12 text-center shadow-glow md:px-12">
          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-aqua/60" />
          <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
            {siteConfig.finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62">
            {siteConfig.finalCta.body}
          </p>
          <div className="mt-8">
            <ButtonLink href={siteConfig.cta.href}>
              <Zap className="size-4" />
              {siteConfig.cta.checkoutLabel}
            </ButtonLink>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {siteConfig.finalCta.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-white/42">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
