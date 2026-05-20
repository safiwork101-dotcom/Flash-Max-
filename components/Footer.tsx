import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/src/config/siteConfig";

export function Footer() {
  return (
    <footer className="border-t border-line bg-night/80 py-12">
      <div className="section-shell grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-aqua/30 bg-aqua/10">
              <Image
                src={siteConfig.logoPath}
                alt={`${siteConfig.brandName} logo`}
                width={28}
                height={28}
              />
            </span>
            <span className="text-lg font-black">{siteConfig.brandName}</span>
          </Link>
          {siteConfig.footer.description ? (
            <p className="max-w-md text-sm leading-7 text-white/58">
              {siteConfig.footer.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {siteConfig.socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-white/60 transition hover:border-aqua/50 hover:text-aqua"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <FooterLinks title="QUICK LINKS" links={siteConfig.footer.quickLinks} />
        <FooterLinks title="SUPPORT" links={siteConfig.footer.supportLinks} />
      </div>

      <div className="section-shell mt-10 border-t border-line pt-6">
        <p className="text-xs leading-6 text-white/45">
          {siteConfig.footer.copyright}
        </p>
        <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
          {siteConfig.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-black text-white/90">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/52 transition hover:text-aqua"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
