"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Copy, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/src/config/siteConfig";

type ProductSlug = (typeof siteConfig.products)[number]["slug"];

export function PaymentPanel() {
  const [selectedSlug, setSelectedSlug] = useState<ProductSlug>(
    siteConfig.products[1]?.slug ?? siteConfig.products[0].slug,
  );
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = useMemo(
    () =>
      siteConfig.products.find((product) => product.slug === selectedSlug) ??
      siteConfig.products[0],
    [selectedSlug],
  );

  async function copyAddress() {
    await navigator.clipboard.writeText(siteConfig.payment.walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function submitConfirmation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="pb-24 pt-32">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-black text-aqua">CHECKOUT</p>
          <h1 className="text-4xl font-black text-white md:text-6xl">
            {siteConfig.payment.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
            {siteConfig.payment.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.12fr]">
          <div className="space-y-4">
            {siteConfig.products.map((product) => (
              <button
                type="button"
                key={product.slug}
                onClick={() => setSelectedSlug(product.slug)}
                className={cn(
                  "w-full rounded-lg border p-5 text-left transition",
                  selectedSlug === product.slug
                    ? "border-aqua bg-aqua/10 shadow-glow"
                    : "border-line bg-white/[0.035] hover:border-aqua/40",
                )}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-lg font-black text-white">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/52">
                      {product.summary}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 px-4 py-3 text-xl font-black text-aqua">
                    {product.priceLabel}
                  </div>
                </div>

                <ul className="mt-5 grid gap-2 text-sm text-white/58">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 text-mint" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="glass-card rounded-lg p-5 md:p-7">
            <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white/45">Order Summary</p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  {selectedProduct.name}
                </h2>
              </div>
              <div className="rounded-lg bg-aqua px-5 py-3 text-2xl font-black text-night">
                {selectedProduct.priceLabel}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-[180px_1fr]">
              <div className="rounded-lg border border-line bg-white p-4">
                <Image
                  src={siteConfig.payment.qrImage}
                  alt="Placeholder payment QR"
                  width={320}
                  height={320}
                  className="h-auto w-full rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <InfoRow label="Token" value={siteConfig.payment.tokenName} />
                <InfoRow
                  label="Network"
                  value={siteConfig.payment.paymentNetwork}
                />
                <InfoRow
                  label={siteConfig.payment.minimumDepositLabel}
                  value={siteConfig.payment.minimumDepositValue}
                />
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-line bg-night/55 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                <Wallet className="size-4 text-aqua" />
                {siteConfig.payment.walletLabel}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <code className="min-w-0 flex-1 break-all rounded-lg border border-line bg-black/40 px-4 py-3 text-sm text-white/75">
                  {siteConfig.payment.walletAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-aqua px-4 text-sm font-black text-night transition hover:bg-mint"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-ember/20 bg-ember/[0.07] p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-black text-ember">
                <ShieldCheck className="size-4" />
                Payment Instructions
              </p>
              <ul className="space-y-3 text-sm leading-6 text-white/62">
                {siteConfig.payment.instructions.map((instruction) => (
                  <li key={instruction} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={submitConfirmation} className="mt-6 space-y-4">
              <TextField
                label={siteConfig.payment.confirmationFields.transactionIdLabel}
                placeholder="Paste transaction ID"
              />
              <TextField
                label={siteConfig.payment.confirmationFields.contactLabel}
                placeholder="you@example.com"
              />
              <label className="block">
                <span className="mb-2 block text-sm font-black text-white/76">
                  {siteConfig.payment.confirmationFields.noteLabel}
                </span>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-line bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-aqua"
                  placeholder="Optional order note"
                />
              </label>

              <button
                type="submit"
                className="min-h-12 w-full rounded-lg bg-aqua px-5 text-sm font-black text-night shadow-button transition hover:bg-mint"
              >
                {siteConfig.payment.confirmationFields.submitLabel}
              </button>

              {submitted ? (
                <p className="rounded-lg border border-mint/25 bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">
                  Confirmation captured in the interface. Connect your own
                  backend before processing real orders.
                </p>
              ) : null}
            </form>

            <div className="mt-6 flex flex-col gap-3 rounded-lg border border-line bg-white/[0.03] p-4 text-sm text-white/54 sm:flex-row sm:items-center sm:justify-between">
              <span>{siteConfig.payment.supportText}</span>
              <Link
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-4 font-black text-white transition hover:border-aqua/50 hover:text-aqua"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.035] p-4">
      <p className="text-xs font-bold text-white/40">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function TextField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/76">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-lg border border-line bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-aqua"
        placeholder={placeholder}
      />
    </label>
  );
}
