"use client";

import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Cpu,
  Globe2,
  Lock,
  Monitor,
  Shield,
  Sparkles,
  Users,
  Zap,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/src/config/siteConfig";

const useCaseIcons = [Shield, Monitor, Clock, Cpu, Users];
const featureIcons = [Check, Lock, Clock, Globe2];

export function GeneratorSection() {
  const [amountIndex, setAmountIndex] = useState(3);
  const [durationIndex, setDurationIndex] = useState(0);
  const [networkIndex, setNetworkIndex] = useState(0);
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [address, setAddress] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderError, setOrderError] = useState("");
  const [copied, setCopied] = useState(false);

  const amount = siteConfig.generator.amountOptions[amountIndex];
  const duration = siteConfig.generator.durations[durationIndex];
  const network = siteConfig.generator.networks[networkIndex];
  const selectedCurrency =
    siteConfig.generator.paymentModal.currencies[currencyIndex];
  const selectedPaymentAddress =
    "paymentAddress" in selectedCurrency && selectedCurrency.paymentAddress
      ? selectedCurrency.paymentAddress
      : siteConfig.generator.paymentModal.paymentAddress;
  const selectedQrImage =
    "qrImage" in selectedCurrency && selectedCurrency.qrImage
      ? selectedCurrency.qrImage
      : siteConfig.generator.paymentModal.qrImage;

  const totalPrice = useMemo(
    () => Math.round(amount.price * duration.multiplier),
    [amount.price, duration.multiplier],
  );
  const paymentAmount = `${totalPrice.toFixed(2)} ${selectedCurrency.symbol}`;

  const isAddressValid = validateAddress(address, network.type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAddressValid || isCreatingOrder) {
      return;
    }

    setIsCreatingOrder(true);
    setOrderError("");

    try {
      const paymentCurrencyDisplay =
        "displaySymbol" in selectedCurrency && selectedCurrency.displaySymbol
          ? selectedCurrency.displaySymbol
          : selectedCurrency.symbol;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountLabel: amount.label,
          token: amount.token,
          duration: duration.label,
          priceUsd: totalPrice,
          networkLabel: network.label,
          networkShortLabel: network.shortLabel,
          networkType: network.type,
          targetAddress: address,
          paymentCurrencyName: selectedCurrency.name,
          paymentCurrencySymbol: selectedCurrency.symbol,
          paymentCurrencyDisplay,
          paymentAmount,
          paymentAddress: selectedPaymentAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Order could not be saved.");
      }

      const data = (await response.json()) as { order?: { id?: string } };
      setOrderId(data.order?.id ?? "");
      setIsPaymentOpen(true);
    } catch {
      setOrderError("Order could not be saved. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  }

  async function copyPaymentAddress() {
    await navigator.clipboard.writeText(selectedPaymentAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section id="generator" className="scroll-mt-28 pb-24 pt-2">
      <div className="mx-auto w-[min(100%-32px,620px)]">
        <div className="grid gap-4 sm:grid-cols-3">
          {siteConfig.generator.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-line bg-panel/92 px-5 py-5 text-center shadow-glow"
            >
              <p className="font-mono text-2xl font-black tracking-wide text-mint">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-bold tracking-[0.18em] text-white/38">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-9 overflow-hidden rounded-lg border border-line bg-panel/96 shadow-glow"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-mint text-night">
                <Zap className="size-5" />
              </span>
              <h2 className="text-xl font-black text-white">
                {siteConfig.generator.panelTitle}
              </h2>
            </div>
            <span className="rounded-lg bg-mint/10 px-4 py-2 text-xs font-black text-mint">
              {siteConfig.generator.statusLabel}
            </span>
          </div>

          <div className="space-y-7 p-6">
            <FieldLabel icon={<span className="text-lg">$</span>}>
              {siteConfig.generator.amountLabel}
            </FieldLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {siteConfig.generator.amountOptions.map((option, index) => {
                const isSelected = index === amountIndex;

                return (
                  <button
                    type="button"
                    key={option.label}
                    onClick={() => {
                      setAmountIndex(index);
                      setIsPaymentOpen(false);
                      setOrderId("");
                      setOrderError("");
                    }}
                    className={cn(
                      "relative rounded-lg border p-5 text-left transition",
                      isSelected
                        ? "border-mint bg-mint/10"
                        : "border-line bg-night/70 hover:border-mint/50",
                    )}
                  >
                    {isSelected ? (
                      <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-mint text-night">
                        <Check className="size-4" />
                      </span>
                    ) : null}
                    <div className="flex items-end gap-3">
                      <span className="font-mono text-3xl font-black text-white">
                        {option.label}
                      </span>
                      <span className="pb-1 text-xs font-black text-mint">
                        {option.token}
                      </span>
                    </div>
                    <p className="mt-5 text-sm text-white/42">
                      from{" "}
                      <span className="text-base font-black text-mint">
                        {option.priceLabel}
                      </span>
                    </p>
                    <p className="mt-3 text-sm text-white/42">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <FieldLabel icon={<Clock className="size-4" />}>
                {siteConfig.generator.durationLabel}
              </FieldLabel>
              <SelectBox
                value={durationIndex}
                onChange={(value) => {
                  setDurationIndex(value);
                  setIsPaymentOpen(false);
                  setOrderId("");
                  setOrderError("");
                }}
                options={siteConfig.generator.durations.map((item) => item.label)}
              />
            </div>

            <div>
              <FieldLabel icon={<Globe2 className="size-4" />}>
                {siteConfig.generator.networkLabel}
              </FieldLabel>
              <SelectBox
                value={networkIndex}
                onChange={(value) => {
                  setNetworkIndex(value);
                  setAddress("");
                  setIsPaymentOpen(false);
                  setOrderId("");
                  setOrderError("");
                }}
                options={siteConfig.generator.networks.map((item) => item.label)}
              />
            </div>

            <label className="block">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-black text-white/58">
                  {siteConfig.generator.targetAddressLabel}
                </span>
                <span className="text-sm font-semibold text-white/36">
                  {network.hint}
                </span>
              </div>
              <input
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value.trim());
                  setIsPaymentOpen(false);
                  setOrderId("");
                  setOrderError("");
                }}
                placeholder={network.placeholder}
                className={cn(
                  "h-14 w-full rounded-lg border bg-night/80 px-5 font-mono text-sm text-white outline-none transition placeholder:text-white/32 focus:border-mint",
                  address && !isAddressValid ? "border-coral" : "border-mint",
                )}
              />
            </label>

            <div className="rounded-lg border border-line bg-night/70 p-5">
              <SummaryRow
                label={siteConfig.generator.summaryLabels.amount}
                value={`${amount.label.replace("K", ",000").replace("M", ",000,000")}.00 ${amount.token}`}
              />
              <SummaryRow
                label={siteConfig.generator.summaryLabels.duration}
                value={duration.label}
              />
              <SummaryRow
                label={siteConfig.generator.summaryLabels.price}
                value={`$${totalPrice}.00`}
                accent
              />
            </div>

            <button
              type="submit"
              disabled={!isAddressValid || isCreatingOrder}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-mint px-5 text-base font-black text-night shadow-button transition hover:bg-aqua disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Zap className="size-5" />
              {isCreatingOrder ? "Opening Payment..." : siteConfig.generator.ctaLabel}
            </button>

            {orderError ? (
              <p className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                {orderError}
              </p>
            ) : null}

            {!address ? null : isAddressValid ? (
              <p className="rounded-lg border border-mint/25 bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">
                Address accepted. You can continue to payment.
              </p>
            ) : (
              <p className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                Enter a valid address for {network.label} to continue.
              </p>
            )}
          </div>
        </form>

        {isPaymentOpen ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto rounded-lg border border-line bg-panel shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel/95 px-6 py-5 backdrop-blur">
                <h2 className="text-xl font-black text-white">
                  {siteConfig.generator.paymentModal.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="grid size-10 place-items-center rounded-lg border border-line bg-night/70 text-white/60 transition hover:text-white"
                  aria-label="Close payment"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-lg border border-line bg-night/70 p-5">
                  {orderId ? (
                    <SummaryRow label="Order ID" value={shortenOrderId(orderId)} />
                  ) : null}
                  <SummaryRow
                    label="Flash USDT Amount"
                    value={`${formatAmountLabel(amount.label)}.00 ${amount.token}`}
                    accent
                  />
                  <SummaryRow label="Network" value={network.shortLabel} />
                  <SummaryRow
                    label="Target Address"
                    value={shortenAddress(address)}
                  />
                  <SummaryRow label="Duration" value={duration.label} />
                  <SummaryRow
                    label="Price"
                    value={paymentAmount}
                    accent
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-black tracking-[0.14em] text-white/48">
                    {siteConfig.generator.paymentModal.currencyLabel}
                  </p>
                  <SelectBox
                    value={currencyIndex}
                    onChange={setCurrencyIndex}
                    options={siteConfig.generator.paymentModal.currencies.map(
                      (currency) =>
                        `${currency.name} (${
                          "displaySymbol" in currency && currency.displaySymbol
                            ? currency.displaySymbol
                            : currency.symbol
                        })`,
                    )}
                  />
                </div>

                <div className="rounded-lg border border-mint bg-night/70 p-5 text-center">
                  <p className="text-sm text-white/42">
                    {siteConfig.generator.paymentModal.sendExactlyLabel}
                  </p>
                  <p className="mt-3 text-3xl font-black text-mint">
                    <span className="mr-2 inline-grid size-8 place-items-center rounded-full bg-ember text-xs font-black text-night">
                        {selectedCurrency.icon}
                      </span>
                      {paymentAmount}
                  </p>
                  <p className="mt-6 text-sm text-white/42">
                    {siteConfig.generator.paymentModal.addressLabel}
                  </p>

                  <div className="mx-auto mt-3 max-w-[420px] rounded-lg bg-white p-4">
                    <img
                      src={selectedQrImage}
                      alt="Payment QR placeholder"
                      className="mx-auto h-auto max-h-[220px] w-auto"
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <code className="min-w-0 flex-1 break-all rounded-lg border border-line bg-black/40 px-4 py-3 text-left text-xs font-bold text-white/72">
                      {selectedPaymentAddress}
                    </code>
                    <button
                      type="button"
                      onClick={copyPaymentAddress}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-mint px-4 text-sm font-black text-night transition hover:bg-aqua"
                    >
                      <Copy className="size-4" />
                      {copied
                        ? siteConfig.generator.paymentModal.copiedLabel
                        : siteConfig.generator.paymentModal.copyLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <NetworkAndProofBlocks />
      </div>
    </section>
  );
}

function GeneratorInfoBlocks() {
  return (
    <div className="pt-10">
      <p className="mb-5 text-center text-xs font-black tracking-[0.22em] text-white/38">
        {siteConfig.generator.useCasesEyebrow}
      </p>

      <div className="space-y-4">
        {siteConfig.generator.useCases.map((useCase, index) => {
          const Icon = useCaseIcons[index % useCaseIcons.length];

          return (
            <article
              key={useCase.title}
              className="flex gap-5 rounded-lg border border-line bg-panel/90 p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-mint/10 text-mint">
                <Icon className="size-6" />
              </span>
              <div>
                <h3 className="font-black text-white">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {useCase.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <article className="mt-9 rounded-lg border border-line bg-panel/90 p-6">
        <h3 className="flex items-center gap-3 text-lg font-black text-white">
          <Cpu className="size-5 text-mint" />
          {siteConfig.generator.howItWorks.title}
        </h3>
        <p className="mt-5 text-sm leading-7 text-white/62">
          {siteConfig.generator.howItWorks.description}
        </p>
      </article>

      <article className="mt-9 rounded-lg border border-line bg-panel/90 p-6">
        <h3 className="flex items-center gap-3 text-lg font-black text-white">
          <Sparkles className="size-5 text-mint" />
          {siteConfig.generator.keyFeatures.title}
        </h3>
        <div className="mt-6 space-y-6">
          {siteConfig.generator.keyFeatures.items.map((item, index) => {
            const Icon = featureIcons[index % featureIcons.length];

            return (
              <div key={item.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mint/10 text-mint">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h4 className="font-black text-white">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-white/58">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="mt-9 rounded-lg border border-line bg-panel/90 p-6">
        <h3 className="mb-6 flex items-center gap-3 text-lg font-black text-white">
          <Monitor className="size-5 text-mint" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {siteConfig.generator.generatorFaq.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-line bg-night/70 p-5"
            >
              <h4 className="font-black text-white">{item.question}</h4>
              <p className="mt-3 text-sm leading-6 text-white/58">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </article>

      <div className="py-12 text-center">
        <p className="mb-5 text-xs font-black tracking-[0.22em] text-white/38">
          {siteConfig.generator.supportedNetworksLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {siteConfig.generator.supportedNetworks.map((network) => (
            <span
              key={network.id}
              className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.04] font-mono text-xs font-black text-mint"
            >
              {network.label}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-line py-8 text-center">
        <p className="text-sm font-bold text-white/50">
          {siteConfig.generator.protocolLine}
          <span className="mx-3 text-white/18">·</span>
          {siteConfig.generator.version}
        </p>
        <p className="mt-3 text-xs text-white/28">
          {siteConfig.generator.networkLine}
        </p>
      </div>
    </div>
  );
}

function NetworkAndProofBlocks() {
  return (
    <div className="pt-10">
      <div className="py-12 text-center">
        <p className="mb-5 text-xs font-black tracking-[0.22em] text-white/38">
          {siteConfig.generator.supportedNetworksLabel}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {siteConfig.generator.supportedNetworks.map((network) => (
            <span
              key={network.id}
              title={network.label}
              className="grid size-11 place-items-center transition duration-200 hover:scale-110"
            >
              <NetworkIcon id={network.id} />
            </span>
          ))}
        </div>
      </div>

      <section id="proof" className="scroll-mt-28 pb-4">
        <p className="mb-3 text-center text-xs font-black tracking-[0.22em] text-white/38">
          {siteConfig.generator.proof.eyebrow}
        </p>
        <h2 className="text-center text-2xl font-black text-white">
          {siteConfig.generator.proof.title}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {siteConfig.generator.proof.items.map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-line bg-panel/90 p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-mint/50"
            >
              <p className="text-xs font-black tracking-[0.14em] text-white/36">
                {item.label}
              </p>
              <p className="mt-3 font-mono text-lg font-black text-mint">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-semibold text-white/42">
                {item.meta}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function NetworkIcon({ id }: { id: string }) {
  const common = "h-10 w-10 drop-shadow-[0_0_16px_rgba(47,244,177,0.18)]";

  if (id === "eth") {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 3 9 21l11-6 11 6L20 3Z" fill="#6f737c" />
        <path d="M20 15 9 21l11 6 11-6-11-6Z" fill="#42464f" />
        <path d="M9 23 20 37l11-14-11 6-11-6Z" fill="#8c9099" />
      </svg>
    );
  }

  if (id === "bnb") {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="#d9a514" />
        <path
          d="m20 9 5 5-5 5-5-5 5-5Zm-8 8 5 5-5 5-5-5 5-5Zm16 0 5 5-5 5-5-5 5-5Zm-8 8 5 5-5 5-5-5 5-5Zm0-8 3 3-3 3-3-3 3-3Z"
          fill="#f8e7a0"
        />
      </svg>
    );
  }

  if (id === "tron") {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M7 6 35 12 17 35 7 6Z"
          fill="none"
          stroke="#ff1738"
          strokeWidth="3"
        />
        <path
          d="m7 6 12 13 16-7M19 19l-2 16"
          stroke="#ff1738"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (id === "polygon") {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M14 14 8 17.5v7L14 28l6-3.5v-7L14 14Zm12-6-6 3.5v7l6 3.5 6-3.5v-7L26 8ZM20 18.5l6 3.5"
          fill="none"
          stroke="#7c35ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    );
  }

  if (id === "arbitrum") {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M20 4 34 12v16L20 36 6 28V12L20 4Z"
          fill="#17202b"
          stroke="#75a7d9"
          strokeWidth="2"
        />
        <path
          d="M15 30 26 9M21 32 31 14M10 25 20 6"
          stroke="#9cc7ee"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="#2d76ff" />
      <path
        d="M10 20h20"
        stroke="#d7e6ff"
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  );
}

function FieldLabel({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 text-sm font-black text-white/58">
      <span className="text-mint">{icon}</span>
      {children}
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (value: number) => void;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-14 w-full appearance-none rounded-lg border border-line bg-night/80 px-5 pr-12 text-base font-black text-white outline-none transition focus:border-mint"
      >
        {options.map((option, index) => (
          <option key={option} value={index}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-white/42" />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <span className="text-sm text-white/44">{label}</span>
      <span
        className={cn(
          "text-right font-mono text-sm font-black",
          accent ? "text-mint" : "text-white",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function formatAmountLabel(label: string) {
  if (label.endsWith("K")) {
    return `${label.replace("K", "")},000`;
  }

  if (label.endsWith("M")) {
    return `${label.replace("M", "")},000,000`;
  }

  return label;
}

function shortenAddress(address: string) {
  if (address.length <= 14) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function shortenOrderId(id: string) {
  if (id.length <= 18) {
    return id;
  }

  return `${id.slice(0, 12)}...${id.slice(-4)}`;
}

function validateAddress(address: string, networkType: string) {
  if (!address) {
    return false;
  }

  const validators: Record<string, RegExp> = {
    evm: /^0x[a-fA-F0-9]{40}$/,
    tron: /^T[a-zA-Z0-9]{33}$/,
    bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/i,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    litecoin: /^(ltc1|[LM3])[a-zA-HJ-NP-Z0-9]{26,90}$/i,
    xrp: /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/,
  };

  return (validators[networkType] ?? validators.evm).test(address);
}
