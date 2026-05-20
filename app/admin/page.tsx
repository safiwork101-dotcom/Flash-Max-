"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Copy,
  CreditCard,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  createdAt: string;
  date: string;
  status: string;
  amountLabel: string;
  token: string;
  duration: string;
  priceUsd: number;
  priceLabel: string;
  networkLabel: string;
  networkShortLabel: string;
  targetAddress: string;
  paymentCurrencyName: string;
  paymentCurrencySymbol: string;
  paymentCurrencyDisplay: string;
  paymentAmount: string;
  paymentAddress: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.priceUsd || 0),
      0,
    );
    const paidCurrencies = new Set(
      orders.map((order) => order.paymentCurrencyDisplay).filter(Boolean),
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalReviews: reviews.length,
      paidCurrencies: paidCurrencies.size,
    };
  }, [orders, reviews]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadDashboard();
  }

  async function loadDashboard() {
    if (!adminKey.trim()) {
      setMessage("Admin key enter karo, phir dashboard open hoga.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const [ordersResponse, reviewsResponse] = await Promise.all([
        fetch("/api/orders", {
          cache: "no-store",
          headers: { "x-admin-key": adminKey },
        }),
        fetch("/api/reviews", { cache: "no-store" }),
      ]);

      const ordersData = (await ordersResponse.json().catch(() => ({}))) as {
        orders?: Order[];
        error?: string;
      };
      const reviewsData = (await reviewsResponse.json().catch(() => ({}))) as {
        reviews?: Review[];
      };

      if (!ordersResponse.ok) {
        throw new Error(ordersData.error ?? "Dashboard could not open.");
      }

      setOrders(ordersData.orders ?? []);
      setReviews(reviewsData.reviews ?? []);
      setHasLoaded(true);
      setMessage("Dashboard updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Dashboard could not open.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteOrder(id: string) {
    const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      deleted?: boolean;
    };

    if (!response.ok) {
      setMessage(data.error ?? "Order delete nahi hua.");
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== id),
    );
    setMessage(data.deleted ? "Order deleted." : "Order not found.");
  }

  async function deleteReview(id: string) {
    const response = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      deleted?: boolean;
    };

    if (!response.ok) {
      setMessage(data.error ?? "Review delete nahi hua.");
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.filter((review) => review.id !== id),
    );
    setMessage(data.deleted ? "Review deleted." : "Review not found.");
  }

  async function copyText(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <main className="min-h-screen bg-night px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.22em] text-white/38">
              ADMIN PANEL
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-black sm:text-4xl">
              <ShieldCheck className="size-8 text-mint" />
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/54">
              Yahan buy/order records, payment details, target addresses, aur
              user reviews manage honge.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 rounded-lg border border-line bg-panel/90 p-4 sm:flex-row lg:max-w-xl"
          >
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin key"
              type="password"
              className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-night/80 px-4 text-sm text-white outline-none focus:border-mint"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-night transition hover:bg-aqua disabled:opacity-60"
            >
              <RefreshCw
                className={cn("size-4", isLoading ? "animate-spin" : "")}
              />
              {isLoading ? "Loading..." : "Open"}
            </button>
          </form>
        </div>

        {message ? (
          <p className="mb-6 rounded-lg border border-line bg-panel/90 px-4 py-3 text-sm font-semibold text-white/70">
            {message}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CreditCard className="size-5" />}
            label="Total Orders"
            value={String(dashboardStats.totalOrders)}
          />
          <StatCard
            icon={<BarChart3 className="size-5" />}
            label="Order Value"
            value={`$${dashboardStats.totalRevenue.toFixed(2)}`}
          />
          <StatCard
            icon={<MessageSquare className="size-5" />}
            label="Reviews"
            value={String(dashboardStats.totalReviews)}
          />
          <StatCard
            icon={<Users className="size-5" />}
            label="Currencies"
            value={String(dashboardStats.paidCurrencies)}
          />
        </div>

        {!hasLoaded ? (
          <div className="mt-8 rounded-lg border border-line bg-panel/90 p-6 text-sm leading-6 text-white/58">
            Admin key enter karke <span className="font-black text-mint">Open</span>{" "}
            press karo. Orders private rahenge aur key ke baghair show nahi
            honge.
          </div>
        ) : null}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">Orders</h2>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-4 text-sm font-black text-white/72 transition hover:border-mint hover:text-white"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {hasLoaded && orders.length === 0 ? (
              <EmptyPanel text="Abhi koi order save nahi hua." />
            ) : (
              orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-lg border border-line bg-panel/92 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black">
                          {order.amountLabel} {order.token}
                        </h3>
                        <span className="rounded-lg bg-mint/10 px-3 py-1 text-xs font-black text-mint">
                          {order.priceLabel}
                        </span>
                        <span className="rounded-lg border border-line px-3 py-1 text-xs font-black text-white/54">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/36">
                        {order.date} - {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void deleteOrder(order.id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-coral/30 px-4 text-sm font-black text-coral transition hover:bg-coral/10"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    <InfoRow label="Network" value={order.networkLabel} />
                    <InfoRow label="Duration" value={order.duration} />
                    <InfoRow
                      label="Target Address"
                      value={shortenAddress(order.targetAddress)}
                      copyValue={order.targetAddress}
                      onCopy={copyText}
                      copied={copied}
                    />
                    <InfoRow
                      label="Payment"
                      value={`${order.paymentAmount} (${order.paymentCurrencyDisplay})`}
                    />
                    <InfoRow
                      label="Payment Address"
                      value={shortenAddress(order.paymentAddress)}
                      copyValue={order.paymentAddress}
                      onCopy={copyText}
                      copied={copied}
                    />
                    <InfoRow label="Order ID" value={order.id} />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Reviews</h2>
          <div className="space-y-4">
            {hasLoaded && reviews.length === 0 ? (
              <EmptyPanel text="Abhi koi review nahi hai." />
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border border-line bg-panel/92 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-black">{review.name}</h3>
                      <p className="mt-1 text-xs text-white/38">{review.date}</p>
                      <div className="mt-3 flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            className={cn(
                              "size-4",
                              value <= review.rating
                                ? "fill-ember text-ember"
                                : "text-white/20",
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={review.id.startsWith("default-")}
                      onClick={() => void deleteReview(review.id)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-coral/30 px-4 text-sm font-black text-coral transition hover:bg-coral/10 disabled:cursor-not-allowed disabled:border-line disabled:text-white/24"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/62">
                    {review.text}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-lg border border-line bg-panel/92 p-5 shadow-glow">
      <div className="mb-4 grid size-10 place-items-center rounded-lg bg-mint/10 text-mint">
        {icon}
      </div>
      <p className="font-mono text-3xl font-black text-mint">{value}</p>
      <p className="mt-2 text-xs font-black tracking-[0.16em] text-white/38">
        {label}
      </p>
    </article>
  );
}

function InfoRow({
  label,
  value,
  copyValue,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copyValue?: string;
  copied?: string;
  onCopy?: (value: string, label: string) => Promise<void>;
}) {
  return (
    <div className="rounded-lg border border-line bg-night/70 p-4">
      <p className="mb-2 text-xs font-black tracking-[0.14em] text-white/34">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 break-all text-sm font-bold text-white/72">
          {value}
        </p>
        {copyValue && onCopy ? (
          <button
            type="button"
            onClick={() => void onCopy(copyValue, label)}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-white/56 transition hover:border-mint hover:text-mint"
            aria-label={`Copy ${label}`}
          >
            <Copy className="size-4" />
          </button>
        ) : null}
      </div>
      {copied === label ? (
        <p className="mt-2 text-xs font-black text-mint">Copied</p>
      ) : null}
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-line bg-panel/90 p-5 text-sm text-white/54">
      {text}
    </div>
  );
}

function shortenAddress(address: string) {
  if (address.length <= 16) {
    return address;
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
