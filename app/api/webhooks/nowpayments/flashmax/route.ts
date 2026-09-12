import { NextResponse } from "next/server";
import { applyFlashMaxPaymentEvent } from "@/lib/flashmax/payments";
import { verifyNowPaymentsSignature, type NowPayment } from "@/lib/flashmax/nowpayments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-nowpayments-sig") ?? "";
  if (!verifyNowPaymentsSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid IPN signature." }, { status: 401 });
  }

  let payment: NowPayment;
  try {
    payment = JSON.parse(rawBody || "{}") as NowPayment;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payment.payment_id && !payment.order_id) {
    return NextResponse.json({ received: true, ignored: "Missing payment reference." });
  }

  const order = await applyFlashMaxPaymentEvent(payment);
  return NextResponse.json({ received: true, matched: Boolean(order), status: payment.payment_status ?? "unknown" });
}
