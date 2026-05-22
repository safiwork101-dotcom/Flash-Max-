import { NextResponse } from "next/server";
import { addStoredOrder, readStoredOrders } from "@/lib/orders/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const adminSecret = "chotiluli123";

export async function GET(request: Request) {
  const adminKey = request.headers.get("x-admin-key") ?? "";

  if (adminKey !== adminSecret) {
    return NextResponse.json({ error: "Invalid admin key." }, { status: 401 });
  }

  const orders = await readStoredOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        amountLabel?: unknown;
        token?: unknown;
        duration?: unknown;
        priceUsd?: unknown;
        networkLabel?: unknown;
        networkShortLabel?: unknown;
        networkType?: unknown;
        targetAddress?: unknown;
        paymentCurrencyName?: unknown;
        paymentCurrencySymbol?: unknown;
        paymentCurrencyDisplay?: unknown;
        paymentAmount?: unknown;
        paymentAddress?: unknown;
      }
    | null;

  const targetAddress =
    typeof body?.targetAddress === "string" ? body.targetAddress : "";
  const paymentAddress =
    typeof body?.paymentAddress === "string" ? body.paymentAddress : "";

  if (!targetAddress.trim() || !paymentAddress.trim()) {
    return NextResponse.json(
      { error: "Target address and payment address are required." },
      { status: 400 },
    );
  }

  const order = await addStoredOrder({
    amountLabel: stringValue(body?.amountLabel),
    token: stringValue(body?.token),
    duration: stringValue(body?.duration),
    priceUsd: numberValue(body?.priceUsd),
    networkLabel: stringValue(body?.networkLabel),
    networkShortLabel: stringValue(body?.networkShortLabel),
    networkType: stringValue(body?.networkType),
    targetAddress,
    paymentCurrencyName: stringValue(body?.paymentCurrencyName),
    paymentCurrencySymbol: stringValue(body?.paymentCurrencySymbol),
    paymentCurrencyDisplay: stringValue(body?.paymentCurrencyDisplay),
    paymentAmount: stringValue(body?.paymentAmount),
    paymentAddress,
  });

  return NextResponse.json({ order }, { status: 201 });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}
