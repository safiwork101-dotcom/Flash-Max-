import { WalletCards } from "lucide-react";
import { siteConfig } from "@/src/config/siteConfig";

export function PlatformMarquee() {
  const repeated = [...siteConfig.platforms, ...siteConfig.platforms];

  return (
    <section className="py-10">
      <div className="section-shell">
        <p className="mb-6 text-center text-sm font-semibold text-white/44">
          Compatible with leading platforms
        </p>
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-3">
            {repeated.map((platform, index) => (
              <div
                key={`${platform}-${index}`}
                className="flex h-12 min-w-40 items-center justify-center gap-2 rounded-lg border border-line bg-white/[0.035] px-5 text-sm font-black text-white/72"
              >
                <WalletCards className="size-4 text-aqua" />
                {platform}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
