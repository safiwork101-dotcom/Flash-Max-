"use client";

import Link from "next/link";
import { BarChart3, Bell, Clock, Copy, CreditCard, RefreshCw, Save, ShieldCheck, Users } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { FlashMaxOrder } from "@/lib/flashmax/payments";

type AdminOrder = FlashMaxOrder & { flashmax_profiles: { email: string } | null };
type Settings = {
  confirmed_title: string;
  confirmed_message: string;
  followup_title: string;
  followup_message: string;
  telegram_url: string | null;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [customerCount, setCustomerCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState("");

  const stats = useMemo(() => ({
    total: orders.length,
    customers: customerCount,
    finished: orders.filter((order) => order.status === "finished").length,
    paidRevenue: orders.filter((order) => order.status === "finished").reduce((sum, order) => sum + Number(order.price_usd), 0),
    partial: orders.filter((order) => order.status === "partially_paid").length,
  }), [customerCount, orders]);

  async function loadDashboard(event?: FormEvent) {
    event?.preventDefault();
    if (!adminKey.trim()) return setMessage("Enter the admin key.");
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/flashmax/admin/dashboard", { cache: "no-store", headers: { "x-admin-key": adminKey } });
      const data = (await response.json().catch(() => ({}))) as { orders?: AdminOrder[]; settings?: Settings; customerCount?: number; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Dashboard could not be loaded.");
      setOrders(data.orders ?? []);
      setSettings(data.settings ?? null);
      setCustomerCount(data.customerCount ?? 0);
      setOpened(true);
      setMessage("Dashboard updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Dashboard could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setLoading(true);
    try {
      const response = await fetch("/api/flashmax/admin/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(settings),
      });
      const data = (await response.json().catch(() => ({}))) as { settings?: Settings; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Settings could not be saved.");
      setSettings(data.settings ?? settings);
      setMessage("Customer messages and Telegram link saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Settings could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  if (!opened) {
    return (
      <main className="grid min-h-screen place-items-center bg-night px-4 text-white">
        <form onSubmit={loadDashboard} className="w-full max-w-md rounded-lg border border-line bg-panel p-7">
          <ShieldCheck className="size-8 text-mint" />
          <h1 className="mt-5 text-3xl font-black">Flash Max Admin</h1>
          <p className="mt-3 text-sm leading-6 text-white/50">Payment accounting and customer notification settings.</p>
          <input type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="Admin key" className="mt-6 h-12 w-full rounded-lg border border-line bg-night px-4 outline-none focus:border-mint" />
          <button disabled={loading} className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-mint font-black text-night disabled:opacity-50"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Open dashboard</button>
          {message ? <p className="mt-4 text-sm font-semibold text-coral">{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-night px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-line pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-black text-mint">FLASH MAX ADMIN</p><h1 className="mt-2 text-4xl font-black">Payment operations</h1></div>
          <div className="flex gap-2"><Link href="/admin/reviews" className="inline-flex h-11 items-center rounded-lg border border-line px-4 text-sm font-black text-white/65">Reviews</Link><button type="button" onClick={() => void loadDashboard()} className="grid size-11 place-items-center rounded-lg border border-line" title="Refresh dashboard"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></button></div>
        </header>

        {message ? <p className="mt-5 rounded-lg border border-line bg-panel px-4 py-3 text-sm font-semibold text-white/70">{message}</p> : null}

        <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat icon={<CreditCard className="size-5" />} label="Orders" value={String(stats.total)} />
          <Stat icon={<Users className="size-5" />} label="Customers" value={String(stats.customers)} />
          <Stat icon={<ShieldCheck className="size-5" />} label="Finished" value={String(stats.finished)} />
          <Stat icon={<BarChart3 className="size-5" />} label="Paid revenue" value={`$${stats.paidRevenue.toFixed(2)}`} />
          <Stat icon={<Clock className="size-5" />} label="Partial" value={String(stats.partial)} />
        </section>

        {settings ? (
          <form onSubmit={saveSettings} className="mt-10 border-y border-line py-8">
            <div className="mb-6"><h2 className="flex items-center gap-2 text-2xl font-black"><Bell className="size-5 text-aqua" /> Customer notifications</h2><p className="mt-2 text-sm text-white/45">The first message appears when NOWPayments reports Finished. The follow-up and Telegram link appear 20 minutes later.</p></div>
            <div className="grid gap-5 lg:grid-cols-2">
              <MessageFields title="Immediate notification" titleValue={settings.confirmed_title} messageValue={settings.confirmed_message} onTitle={(value) => setSettings({ ...settings, confirmed_title: value })} onMessage={(value) => setSettings({ ...settings, confirmed_message: value })} />
              <MessageFields title="20-minute follow-up" titleValue={settings.followup_title} messageValue={settings.followup_message} onTitle={(value) => setSettings({ ...settings, followup_title: value })} onMessage={(value) => setSettings({ ...settings, followup_message: value })} />
            </div>
            <label className="mt-5 block max-w-2xl"><span className="mb-2 block text-xs font-black text-white/45">TELEGRAM CHANNEL OR SUPPORT LINK</span><input type="url" value={settings.telegram_url ?? ""} onChange={(event) => setSettings({ ...settings, telegram_url: event.target.value })} placeholder="https://t.me/..." className="h-12 w-full rounded-lg border border-line bg-panel px-4 outline-none focus:border-aqua" /></label>
            <button disabled={loading} className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-aqua px-5 text-sm font-black text-night disabled:opacity-50"><Save className="size-4" /> Save messages</button>
          </form>
        ) : null}

        <section className="mt-10">
          <h2 className="text-2xl font-black">Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.length === 0 ? <div className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-white/45">No Flash Max payment orders yet.</div> : orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-line bg-panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="font-mono text-xs text-white/35">{order.order_code}</p><h3 className="mt-2 text-lg font-black">{order.credits_label} FlashMax Credits · ${Number(order.price_usd).toFixed(2)}</h3><p className="mt-1 text-sm text-white/45">{order.flashmax_profiles?.email ?? "Unknown customer"}</p></div>
                  <Status status={order.status} />
                </div>
                <div className="mt-5 grid gap-x-8 gap-y-3 text-sm md:grid-cols-2 xl:grid-cols-3">
                  <Info label="Pay amount" value={order.pay_amount ? `${order.pay_amount} ${order.pay_currency.toUpperCase()}` : "Not created"} />
                  <Info label="Actually paid" value={`${Number(order.actually_paid || 0)} ${order.pay_currency.toUpperCase()}`} />
                  <Info label="Payout outcome" value={order.outcome_amount ? `${order.outcome_amount} ${(order.outcome_currency ?? "").toUpperCase()}` : "Pending"} />
                  <Info label="NOWPayments ID" value={order.provider_payment_id ?? "Pending"} copyValue={order.provider_payment_id ?? ""} copied={copied} onCopy={copy} />
                  <Info label="Pay-in address" value={order.payment_address ?? "Pending"} copyValue={order.payment_address ?? ""} copied={copied} onCopy={copy} />
                  <Info label="Target address" value={order.target_address} copyValue={order.target_address} copied={copied} onCopy={copy} />
                  <Info label="Target network" value={order.target_network_label} />
                  <Info label="Provider status" value={order.provider_status} />
                  <Info label="Created" value={new Date(order.created_at).toLocaleString()} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-lg border border-line bg-panel p-4"><span className="text-aqua">{icon}</span><p className="mt-4 text-2xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-white/40">{label}</p></div>; }
function MessageFields({ title, titleValue, messageValue, onTitle, onMessage }: { title: string; titleValue: string; messageValue: string; onTitle: (value: string) => void; onMessage: (value: string) => void }) { return <fieldset><legend className="mb-3 font-black">{title}</legend><input value={titleValue} onChange={(event) => onTitle(event.target.value)} className="h-11 w-full rounded-lg border border-line bg-panel px-4 outline-none focus:border-aqua" /><textarea value={messageValue} onChange={(event) => onMessage(event.target.value)} rows={4} className="mt-3 w-full resize-y rounded-lg border border-line bg-panel px-4 py-3 outline-none focus:border-aqua" /></fieldset>; }
function Status({ status }: { status: string }) { const good = status === "finished"; const partial = status === "partially_paid"; return <span className={`rounded-lg border px-3 py-1 text-xs font-black uppercase ${good ? "border-mint/40 bg-mint/10 text-mint" : partial ? "border-ember/40 bg-ember/10 text-ember" : "border-line text-white/55"}`}>{status.replaceAll("_", " ")}</span>; }
function Info({ label, value, copyValue, copied, onCopy }: { label: string; value: string; copyValue?: string; copied?: string; onCopy?: (value: string, label: string) => Promise<void> }) { const short = value.length > 42 ? `${value.slice(0, 18)}...${value.slice(-10)}` : value; return <div className="flex min-w-0 items-center justify-between gap-3 border-b border-line pb-2"><span className="shrink-0 text-white/38">{label}</span><span className="min-w-0 truncate text-right font-mono font-bold" title={value}>{short}</span>{copyValue && onCopy ? <button type="button" onClick={() => void onCopy(copyValue, `${label}-${copyValue}`)} className="grid size-8 shrink-0 place-items-center rounded-lg border border-line" title={`Copy ${label}`}><Copy className="size-3.5" />{copied === `${label}-${copyValue}` ? <span className="sr-only">Copied</span> : null}</button> : null}</div>; }
