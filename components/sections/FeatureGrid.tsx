import { BadgeCheck, Gauge, Layers, LockKeyhole } from "lucide-react";
import { siteConfig } from "@/src/config/siteConfig";

const icons = [Gauge, Layers, BadgeCheck, LockKeyhole];

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-28 py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-black text-aqua">
            {siteConfig.features.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-black leading-tight text-white md:text-5xl">
            {siteConfig.features.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/58">
            {siteConfig.features.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {siteConfig.features.items.map((feature, index) => {
            const Icon = icons[index % icons.length];

            return (
              <article
                key={feature.title}
                className="glass-card rounded-lg p-7 transition hover:-translate-y-1 hover:border-aqua/35"
              >
                <div className="mb-6 grid size-12 place-items-center rounded-lg bg-aqua/10 text-aqua">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-black text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
