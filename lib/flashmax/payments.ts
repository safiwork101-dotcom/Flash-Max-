import type { NowPayment } from "@/lib/flashmax/nowpayments";
import { paymentEventHash } from "@/lib/flashmax/nowpayments";
import { flashMaxRpc } from "@/lib/flashmax/supabase";

export type FlashMaxOrder = {
  id: string;
  order_code: string;
  user_id: string;
  package_id: string;
  credits_label: string;
  price_usd: number;
  duration_label: string;
  target_network_id: string;
  target_network_label: string;
  target_address: string;
  pay_currency: string;
  provider_payment_id: string | null;
  provider_status: string;
  status: string;
  payment_address: string | null;
  pay_amount: number | null;
  actually_paid: number;
  outcome_amount: number | null;
  outcome_currency: string | null;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
};

export async function applyFlashMaxPaymentEvent(payment: NowPayment) {
  const rows = await flashMaxRpc<FlashMaxOrder[]>("flashmax_apply_payment_event", {
    p_event_hash: paymentEventHash(payment),
    p_provider_payment_id: value(payment.payment_id),
    p_order_code: value(payment.order_id),
    p_provider_status: value(payment.payment_status).toLowerCase(),
    p_pay_amount: numeric(payment.pay_amount),
    p_actually_paid: numeric(payment.actually_paid),
    p_outcome_amount: numeric(payment.outcome_amount),
    p_outcome_currency: value(payment.outcome_currency),
    p_payload: payment,
  });

  return rows[0] ?? null;
}

function value(input: unknown) {
  return typeof input === "string" || typeof input === "number" ? String(input) : "";
}

function numeric(input: unknown) {
  const parsed = typeof input === "number" ? input : Number(input);
  return Number.isFinite(parsed) ? parsed : null;
}
