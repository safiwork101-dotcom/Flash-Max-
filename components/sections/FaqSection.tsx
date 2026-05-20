import { siteConfig } from "@/src/config/siteConfig";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-28 py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-black text-aqua">
            {siteConfig.faq.eyebrow}
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">
            {siteConfig.faq.title}
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {siteConfig.faq.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-lg border border-line bg-white/[0.035] p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-white">
                {item.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-aqua/10 text-aqua transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-white/58">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
