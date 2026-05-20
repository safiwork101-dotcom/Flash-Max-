import Image from "next/image";
import { siteConfig } from "@/src/config/siteConfig";

export function Highlights() {
  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-black text-aqua">
            {siteConfig.highlights.eyebrow}
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">
            {siteConfig.highlights.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-white/58">
            {siteConfig.highlights.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {siteConfig.highlights.images.map((image) => (
            <figure
              key={image.src}
              className="glass-card overflow-hidden rounded-lg p-3"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={680}
                height={520}
                className="h-auto w-full rounded-lg"
              />
              <figcaption className="px-2 pb-2 pt-4 text-sm font-black text-white/70">
                {image.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
