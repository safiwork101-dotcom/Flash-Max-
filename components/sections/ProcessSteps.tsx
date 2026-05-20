import { CreditCard, MousePointerClick, Send } from "lucide-react";
import { siteConfig } from "@/src/config/siteConfig";

const stepIcons = [MousePointerClick, CreditCard, Send];

export function ProcessSteps() {
  return (
    <section id="how-it-works" className="scroll-mt-28 py-20">
      <div className="section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black text-aqua">
              {siteConfig.process.eyebrow}
            </p>
            <h2 className="text-3xl font-black text-white md:text-5xl">
              {siteConfig.process.title}
            </h2>
          </div>
          <div className="h-px flex-1 bg-line md:max-w-xs" />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {siteConfig.process.steps.map((step, index) => {
            const Icon = stepIcons[index % stepIcons.length];

            return (
              <article
                key={step.title}
                className="relative overflow-hidden rounded-lg border border-line bg-white/[0.035] p-7"
              >
                <span className="absolute right-5 top-4 text-6xl font-black text-white/[0.035]">
                  0{index + 1}
                </span>
                <div className="mb-8 grid size-12 place-items-center rounded-lg bg-mint/10 text-mint">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
