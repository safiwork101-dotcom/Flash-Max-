import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

export type StoredOrder = {
  id: string;
  createdAt: string;
  date: string;
  status:
    | "payment_opened"
    | "deposit_notified"
    | "reviewing"
    | "completed"
    | "cancelled";
  depositNotifiedAt?: string;
  amountLabel: string;
  token: string;
  duration: string;
  priceUsd: number;
  priceLabel: string;
  networkLabel: string;
  networkShortLabel: string;
  networkType: string;
  targetAddress: string;
  paymentCurrencyName: string;
  paymentCurrencySymbol: string;
  paymentCurrencyDisplay: string;
  paymentAmount: string;
  paymentAddress: string;
};

const dataDirectory = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL
    ? path.join(os.tmpdir(), "flash-max-data")
    : path.join(process.cwd(), "data");
const ordersFilePath = path.join(dataDirectory, "orders.json");

async function ensureOrdersFile() {
  await fs.mkdir(path.dirname(ordersFilePath), { recursive: true });

  try {
    await fs.access(ordersFilePath);
  } catch {
    await fs.writeFile(ordersFilePath, "[]", "utf8");
  }
}

export async function readStoredOrders(): Promise<StoredOrder[]> {
  await ensureOrdersFile();
  const file = await fs.readFile(ordersFilePath, "utf8");

  try {
    const parsed = JSON.parse(file) as StoredOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addStoredOrder(input: {
  amountLabel: string;
  token: string;
  duration: string;
  priceUsd: number;
  networkLabel: string;
  networkShortLabel: string;
  networkType: string;
  targetAddress: string;
  paymentCurrencyName: string;
  paymentCurrencySymbol: string;
  paymentCurrencyDisplay: string;
  paymentAmount: string;
  paymentAddress: string;
}): Promise<StoredOrder> {
  const orders = await readStoredOrders();
  const now = new Date();
  const priceUsd = Number.isFinite(input.priceUsd) ? input.priceUsd : 0;
  const order: StoredOrder = {
    id: `order-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    date: now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: "payment_opened",
    amountLabel: sanitizeText(input.amountLabel, 24),
    token: sanitizeText(input.token, 16),
    duration: sanitizeText(input.duration, 40),
    priceUsd,
    priceLabel: `$${priceUsd.toFixed(2)}`,
    networkLabel: sanitizeText(input.networkLabel, 60),
    networkShortLabel: sanitizeText(input.networkShortLabel, 16),
    networkType: sanitizeText(input.networkType, 20),
    targetAddress: sanitizeAddress(input.targetAddress),
    paymentCurrencyName: sanitizeText(input.paymentCurrencyName, 40),
    paymentCurrencySymbol: sanitizeText(input.paymentCurrencySymbol, 16),
    paymentCurrencyDisplay: sanitizeText(input.paymentCurrencyDisplay, 24),
    paymentAmount: sanitizeText(input.paymentAmount, 32),
    paymentAddress: sanitizeAddress(input.paymentAddress),
  };

  const nextOrders = [order, ...orders].slice(0, 500);
  await fs.writeFile(ordersFilePath, JSON.stringify(nextOrders, null, 2), "utf8");
  return order;
}

export async function deleteStoredOrder(id: string) {
  const orders = await readStoredOrders();
  const nextOrders = orders.filter((order) => order.id !== id);
  await fs.writeFile(ordersFilePath, JSON.stringify(nextOrders, null, 2), "utf8");
  return nextOrders.length !== orders.length;
}

export async function notifyStoredOrderDeposit(
  id: string,
  input: {
    paymentCurrencyName: string;
    paymentCurrencySymbol: string;
    paymentCurrencyDisplay: string;
    paymentAmount: string;
    paymentAddress: string;
  },
) {
  const orders = await readStoredOrders();
  let updatedOrder: StoredOrder | null = null;

  const nextOrders = orders.map((order) => {
    if (order.id !== id) {
      return order;
    }

    updatedOrder = {
      ...order,
      status: "deposit_notified",
      depositNotifiedAt: new Date().toISOString(),
      paymentCurrencyName: sanitizeText(input.paymentCurrencyName, 40),
      paymentCurrencySymbol: sanitizeText(input.paymentCurrencySymbol, 16),
      paymentCurrencyDisplay: sanitizeText(input.paymentCurrencyDisplay, 24),
      paymentAmount: sanitizeText(input.paymentAmount, 32),
      paymentAddress: sanitizeAddress(input.paymentAddress),
    };

    return updatedOrder;
  });

  if (!updatedOrder) {
    return null;
  }

  await fs.writeFile(ordersFilePath, JSON.stringify(nextOrders, null, 2), "utf8");
  return updatedOrder;
}

function sanitizeText(value: string, maxLength: number) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeAddress(value: string) {
  return value.replace(/[<>\s]/g, "").trim().slice(0, 120);
}
