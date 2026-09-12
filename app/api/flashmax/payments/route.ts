import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { requireFlashMaxUser } from "@/lib/flashmax/auth";
import { createFlashMaxPayment } from "@/lib/flashmax/nowpayments";
import type { FlashMaxOrder } from "@/lib/flashmax/payments";
import { flashMaxRest } from "@/lib/flashmax/supabase";
import {
  getFlashMaxPackage,
  getFlashMaxPaymentCurrency,
  getFlashMaxTargetNetwork,
  isValidTargetAddress,
} from "@/src/config/checkoutConfig";

export async function POST(request: Request) {
  try {
    const user = await requireFlashMaxUser(request);
    const body = (await request.json().catch(() => ({}))) as {
      packageId?: string;
      targetNetworkId?: string;
      targetAddress?: string;
      payCurrency?: string;
    };
    const selectedPackage = getFlashMaxPackage(body.packageId ?? "");
    const network = getFlashMaxTargetNetwork(body.targetNetworkId ?? "");
    const currency = getFlashMaxPaymentCurrency(body.payCurrency ?? "");
    const targetAddress = body.targetAddress?.trim() ?? "";

    if (!selectedPackage || !network || !currency || !isValidTargetAddress(targetAddress, network.type)) {
      return NextResponse.json({ error: "Select a valid package, payment currency, network, and target address." }, { status: 400 });
    }

    const recentOrders = await flashMaxRest<Array<{ id: string }>>("flashmax_orders", {
      query: `?select=id&user_id=eq.${encodeURIComponent(user.id)}&created_at=gte.${encodeURIComponent(new Date(Date.now() - 15 * 60_000).toISOString())}&status=in.(creating,waiting,confirming,confirmed,sending,partially_paid)&limit=5`,
    });
    if (recentOrders.length >= 5) {
      return NextResponse.json({ error: "Too many active payments. Finish or wait for an existing payment before creating another." }, { status: 429 });
    }

    const orderCode = `FM-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const [created] = await flashMaxRest<FlashMaxOrder[]>("flashmax_orders", {
      method: "POST",
      body: [{
        order_code: orderCode,
        user_id: user.id,
        package_id: selectedPackage.id,
        credits_label: selectedPackage.label,
        price_usd: selectedPackage.price,
        duration_label: "60 to 90 Days",
        target_network_id: network.id,
        target_network_label: network.label,
        target_address: targetAddress,
        pay_currency: currency.id,
      }],
    });

    try {
      const payment = await createFlashMaxPayment({
        amountUsd: selectedPackage.price,
        orderId: orderCode,
        description: `FlashMax Credits ${selectedPackage.label}`,
        payCurrency: currency.id,
      });
      const [order] = await flashMaxRest<FlashMaxOrder[]>("flashmax_orders", {
        method: "PATCH",
        query: `?id=eq.${encodeURIComponent(created.id)}`,
        body: {
          provider_payment_id: String(payment.payment_id),
          provider_status: String(payment.payment_status ?? "waiting").toLowerCase(),
          status: normalizeStatus(payment.payment_status),
          payment_address: payment.pay_address,
          pay_amount: numberOrNull(payment.pay_amount),
          pay_currency: String(payment.pay_currency ?? currency.id).toLowerCase(),
          updated_at: new Date().toISOString(),
        },
      });

      return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
      await flashMaxRest("flashmax_orders", {
        method: "PATCH",
        query: `?id=eq.${encodeURIComponent(created.id)}`,
        body: {
          status: "failed",
          provider_status: "create_failed",
          provider_error: error instanceof Error ? error.message : "Payment creation failed.",
          updated_at: new Date().toISOString(),
        },
      });
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment could not be created.";
    return NextResponse.json({ error: message }, { status: message === "Login required." ? 401 : 502 });
  }
}

function normalizeStatus(status: unknown) {
  const value = String(status ?? "waiting").toLowerCase();
  return ["waiting", "confirming", "confirmed", "sending", "partially_paid", "finished", "failed", "refunded", "expired"].includes(value)
    ? value
    : "waiting";
}

function numberOrNull(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
