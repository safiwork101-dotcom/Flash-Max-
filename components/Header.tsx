"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/src/config/siteConfig";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function openGenerator() {
    setIsOpen(false);

    if (window.location.pathname === "/") {
      document.getElementById("generator")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, "", "/#generator");
      return;
    }

    window.location.assign("/#generator");
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.03] bg-night/60 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-aqua/30 bg-aqua/10 shadow-glow">
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.brandName} logo`}
              width={28}
              height={28}
              priority
            />
          </span>
          <span className="truncate text-lg font-black text-white">
            {siteConfig.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-lg border border-white/[0.04] bg-white/[0.025] p-1 md:flex">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white/56 transition hover:bg-aqua/10 hover:text-aqua"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={openGenerator}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-aqua px-6 text-sm font-extrabold text-night shadow-button transition hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
          >
            <Zap className="size-4" />
            {siteConfig.cta.primaryLabel}
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-lg border border-line bg-white/[0.04] text-white md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="section-shell pb-5 md:hidden">
          <div className="glass-card grid gap-2 rounded-lg p-3">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-white/75 hover:bg-aqua/10 hover:text-aqua"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openGenerator}
              className="mt-1 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-aqua px-5 text-sm font-extrabold text-night shadow-button transition hover:bg-mint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
            >
              <Zap className="size-4" />
              {siteConfig.cta.primaryLabel}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
