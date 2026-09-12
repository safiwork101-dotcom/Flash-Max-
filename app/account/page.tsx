"use client";

import Link from "next/link";
import { Bell, Check, Clock, ExternalLink, LogOut, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import type { FlashMaxOrder } from "@/lib/flashmax/payments";

type User = { id: string; email: string; role: "customer" | "admin" };
type Notification = {
  id: string;
  order_id: string;
  kind: string;
  title: string;
  message: string;
  action_label: string | null;
  action_url: string | null;
  available_at: string;
  read_at: string | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<FlashMaxOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAccount = useCallback(async () => {
    const response = await fetch("/api/flashmax/account", { cache: "no-store" });
    if (response.status === 401) {
      setUser(null);
      setOrders([]);
      setNotifications([]);
      return;
    }
    const data = (await response.json().catch(() => ({}))) as {
      user?: User;
      orders?: FlashMaxOrder[];
      notifications?: Notification[];
      error?: string;
    };
    if (!response.ok) throw new Error(data.error ?? "Account could not be loaded.");
    setUser(data.user ?? null);
    setOrders(data.orders ?? []);
    setNotifications(data.notifications ?? []);
  }, []);

  useEffect(() => {
    // Account data comes from the authenticated API after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAccount().catch((error) => setMessage(error instanceof Error ? error.message : "Account could not be loaded.")).finally(() => setChecking(false));
  }, [loadAccount]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setInterval(() => void loadAccount().catch(() => undefined), 15_000);
    return () => window.clearInterval(timer);
  }, [loadAccount, user]);

  async function authenticate(mode: "login" | "signup", email: string, password: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/flashmax/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json().catch(() => ({}))) as { user?: User; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Authentication failed.");
      setUser(data.user ?? null);
      await loadAccount();
      setMessage(mode === "signup" ? "Account created successfully." : "Welcome back.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/flashmax/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
    setNotifications([]);
    setMessage("You have been logged out.");
  }

  async function markRead(id: string) {
    await fetch(`/api/flashmax/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
  }

  return (
    <SiteShell>
      <section className="min-h-screen pb-24 pt-32 text-white">
        <div className="section-shell">
          <div className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black text-aqua">CUSTOMER ACCOUNT</p>
              <h1 className="mt-3 text-4xl font-black">Orders & notifications</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Track payment confirmations and private delivery updates for your FlashMax Credits orders.</p>
            </div>
            {user ? (
              <button type="button" onClick={logout} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-black text-white/70 hover:border-aqua hover:text-white">
                <LogOut className="size-4" /> Log out
              </button>
            ) : null}
          </div>

          {message ? <p className="mt-6 rounded-lg border border-line bg-panel/90 px-4 py-3 text-sm font-semibold text-white/75">{message}</p> : null}

          {checking ? (
            <div className="grid min-h-64 place-items-center"><RefreshCw className="size-6 animate-spin text-aqua" /></div>
          ) : !user ? (
            <AuthPanel loading={loading} onSubmit={authenticate} />
          ) : (
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-black"><Bell className="size-5 text-aqua" /> Notifications</h2>
                  <span className="text-xs font-black text-white/40">{notifications.filter((item) => !item.read_at).length} unread</span>
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 ? <Empty text="Payment and delivery updates will appear here." /> : notifications.map((notification) => (
                    <article key={notification.id} className={`rounded-lg border p-4 ${notification.read_at ? "border-line bg-panel/70" : "border-aqua/50 bg-aqua/10"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black">{notification.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/65">{notification.message}</p>
                        </div>
                        {!notification.read_at ? <span className="mt-1 size-2 shrink-0 rounded-full bg-aqua" /> : null}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {notification.action_url ? (
                          <a href={notification.action_url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-aqua px-4 text-sm font-black text-night">
                            {notification.action_label ?? "Open"} <ExternalLink className="size-4" />
                          </a>
                        ) : null}
                        {!notification.read_at ? <button type="button" onClick={() => void markRead(notification.id)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-xs font-black text-white/70"><Check className="size-4" /> Mark read</button> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-black"><ShieldCheck className="size-5 text-mint" /> Your orders</h2>
                  <button type="button" onClick={() => void loadAccount()} className="grid size-10 place-items-center rounded-lg border border-line text-white/60" title="Refresh orders"><RefreshCw className="size-4" /></button>
                </div>
                <div className="space-y-3">
                  {orders.length === 0 ? <Empty text="No orders yet. Choose a package to create your first payment." action /> : orders.map((order) => (
                    <article key={order.id} className="rounded-lg border border-line bg-panel/90 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><p className="font-mono text-xs text-white/38">{order.order_code}</p><h3 className="mt-2 text-lg font-black">{order.credits_label} FlashMax Credits</h3></div>
                        <Status status={order.status} />
                      </div>
                      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                        <Row label="Price" value={`$${Number(order.price_usd).toFixed(2)}`} />
                        <Row label="Payment" value={order.pay_amount ? `${order.pay_amount} ${order.pay_currency.toUpperCase()}` : "Preparing"} />
                        <Row label="Received" value={`${Number(order.actually_paid || 0)} ${order.pay_currency.toUpperCase()}`} />
                        <Row label="Created" value={new Date(order.created_at).toLocaleString()} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function AuthPanel({ loading, onSubmit }: { loading: boolean; onSubmit: (mode: "login" | "signup", email: string, password: string) => Promise<void> }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); void onSubmit(mode, email, password); }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-line bg-panel/90 p-6">
      <div className="grid grid-cols-2 rounded-lg border border-line bg-night p-1">
        {(["login", "signup"] as const).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`h-10 rounded-lg text-sm font-black ${mode === item ? "bg-aqua text-night" : "text-white/55"}`}>{item === "login" ? "Log in" : "Create account"}</button>)}
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block"><span className="mb-2 block text-xs font-black text-white/50">EMAIL</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-lg border border-line bg-night px-4 outline-none focus:border-aqua" /></label>
        <label className="block"><span className="mb-2 block text-xs font-black text-white/50">PASSWORD</span><input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-lg border border-line bg-night px-4 outline-none focus:border-aqua" /></label>
        <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aqua px-4 font-black text-night disabled:opacity-50"><UserRound className="size-4" /> {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>
      </form>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const good = status === "finished";
  const partial = status === "partially_paid";
  return <span className={`rounded-lg border px-3 py-1 text-xs font-black uppercase ${good ? "border-mint/40 bg-mint/10 text-mint" : partial ? "border-ember/40 bg-ember/10 text-ember" : "border-line text-white/55"}`}>{status.replaceAll("_", " ")}</span>;
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 border-b border-line pb-2"><span className="text-white/40">{label}</span><span className="text-right font-mono font-bold">{value}</span></div>; }
function Empty({ text, action = false }: { text: string; action?: boolean }) { return <div className="rounded-lg border border-dashed border-line px-5 py-8 text-center text-sm text-white/45"><Clock className="mx-auto mb-3 size-5" /><p>{text}</p>{action ? <Link href="/#generator" className="mt-4 inline-block font-black text-aqua">Choose a package</Link> : null}</div>; }
