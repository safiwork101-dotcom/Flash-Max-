import { NextResponse } from "next/server";
import { isFlashMaxAdmin } from "@/lib/flashmax/auth";
import { deleteStoredOrder, notifyStoredOrderDeposit } from "@/lib/orders/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isFlashMaxAdmin(request)) {
    return NextResponse.json({ error: "Invalid admin key." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteStoredOrder(id);
  return NextResponse.json({ deleted });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Manual deposit notifications are disabled. Payment status is verified by NOWPayments." },
      { status: 410 },
    );
  }
  const body = (await request.json().catch(() => null)) as
    | {
        paymentCurrencyName?: unknown;
        paymentCurrencySymbol?: unknown;
        paymentCurrencyDisplay?: unknown;
        paymentAmount?: unknown;
        paymentAddress?: unknown;
      }
    | null;

  const paymentAddress =
    typeof body?.paymentAddress === "string" ? body.paymentAddress : "";

  if (!paymentAddress.trim()) {
    return NextResponse.json(
      { error: "Payment address is required." },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  const order = await notifyStoredOrderDeposit(id, {
    paymentCurrencyName: stringValue(body?.paymentCurrencyName),
    paymentCurrencySymbol: stringValue(body?.paymentCurrencySymbol),
    paymentCurrencyDisplay: stringValue(body?.paymentCurrencyDisplay),
    paymentAmount: stringValue(body?.paymentAmount),
    paymentAddress,
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
