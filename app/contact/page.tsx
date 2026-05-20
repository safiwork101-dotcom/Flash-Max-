import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/src/config/siteConfig";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="pb-24 pt-32">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-black text-aqua">SUPPORT</p>
            <h1 className="text-4xl font-black text-white md:text-6xl">
              {siteConfig.contact.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
              {siteConfig.contact.body}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
            <ContactCard
              icon={<Mail className="size-6" />}
              label="Email"
              value={siteConfig.contact.email}
              href={`mailto:${siteConfig.contact.email}`}
            />
            <ContactCard
              icon={<Phone className="size-6" />}
              label="Phone"
              value={siteConfig.contact.phone}
              href={`tel:${siteConfig.contact.phone.replaceAll(" ", "")}`}
            />
            <ContactCard
              icon={<MessageCircle className="size-6" />}
              label="WhatsApp"
              value="Open chat"
              href={siteConfig.whatsappLink}
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card rounded-lg p-7 text-center transition hover:-translate-y-1 hover:border-aqua/35"
    >
      <span className="mx-auto mb-5 grid size-12 place-items-center rounded-lg bg-aqua/10 text-aqua">
        {icon}
      </span>
      <p className="text-sm font-bold text-white/42">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-white">{value}</p>
    </Link>
  );
}
