import crypto from "node:crypto";

export type NowPayment = {
  payment_id?: string | number;
  payment_status?: string;
  pay_address?: string;
  pay_amount?: string | number;
  pay_currency?: string;
  price_amount?: string | number;
  price_currency?: string;
  order_id?: string;
  actually_paid?: string | number;
  outcome_amount?: string | number;
  outcome_currency?: string;
  created_at?: string;
  updated_at?: string;
  message?: string;
};

export async function createFlashMaxPayment(input: {
  amountUsd: number;
  orderId: string;
  description: string;
  payCurrency: string;
}) {
  const apiKey = process.env.FLASHMAX_NOWPAYMENTS_API_KEY;
  const callbackUrl = process.env.FLASHMAX_NOWPAYMENTS_IPN_CALLBACK_URL;
  const payoutAddress = process.env.FLASHMAX_PAYOUT_ADDRESS;
  const payoutCurrency = process.env.FLASHMAX_PAYOUT_CURRENCY ?? "usdtbsc";

  if (!apiKey || !callbackUrl || !payoutAddress) {
    throw new Error("Live payment configuration is incomplete.");
  }

  const response = await fetch("https://api.nowpayments.io/v1/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      price_amount: input.amountUsd,
      price_currency: "usd",
      pay_currency: input.payCurrency,
      ipn_callback_url: callbackUrl,
      order_id: input.orderId,
      order_description: input.description,
      payout_address: payoutAddress,
      payout_currency: payoutCurrency,
      fixed_rate: true,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payment = (await response.json().catch(() => ({}))) as NowPayment;

  if (!response.ok || !payment.payment_id || !payment.pay_address) {
    throw new Error(payment.message || "NOWPayments could not create the payment.");
  }

  return payment;
}

export async function getFlashMaxPaymentStatus(paymentId: string) {
  const apiKey = process.env.FLASHMAX_NOWPAYMENTS_API_KEY;
  if (!apiKey) throw new Error("NOWPayments API key is missing.");

  const response = await fetch(`https://api.nowpayments.io/v1/payment/${encodeURIComponent(paymentId)}`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payment = (await response.json().catch(() => ({}))) as NowPayment;

  if (!response.ok) {
    throw new Error(payment.message || "NOWPayments status check failed.");
  }

  return payment;
}

export function verifyNowPaymentsSignature(rawBody: string, signature: string) {
  const secret = process.env.FLASHMAX_NOWPAYMENTS_IPN_SECRET;
  if (!secret || !signature) return false;

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody || "{}");
  } catch {
    return false;
  }

  const expected = crypto.createHmac("sha512", secret).update(JSON.stringify(sortObject(payload))).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function paymentEventHash(payment: NowPayment) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(sortObject(payment)))
    .digest("hex");
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortObject((value as Record<string, unknown>)[key]);
        return result;
      }, {});
  }
  return value;
}
