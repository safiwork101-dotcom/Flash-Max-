import { Quote } from "lucide-react";
import { siteConfig } from "@/src/config/siteConfig";

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-black text-aqua">
            {siteConfig.testimonials.eyebrow}
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">
            {siteConfig.testimonials.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {siteConfig.testimonials.items.map((item) => (
            <article key={item.name} className="glass-card rounded-lg p-7">
              <Quote className="mb-5 size-7 text-aqua" />
              <p className="text-sm leading-7 text-white/64">{item.quote}</p>
              <div className="mt-6">
                <p className="font-black text-white">{item.name}</p>
                <p className="mt-1 text-xs font-semibold text-white/42">
                  {item.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
