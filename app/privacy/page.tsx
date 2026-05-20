import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/src/config/siteConfig";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="pb-24 pt-32">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-black text-aqua">LEGAL</p>
            <h1 className="text-4xl font-black text-white md:text-6xl">
              {siteConfig.legal.privacyTitle}
            </h1>
            <p className="mt-4 text-sm font-semibold text-white/42">
              {siteConfig.legal.updatedLabel}
            </p>
            <div className="glass-card mt-10 rounded-lg p-7">
              <ul className="space-y-5 text-sm leading-7 text-white/62">
                {siteConfig.legal.privacy.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-aqua" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
