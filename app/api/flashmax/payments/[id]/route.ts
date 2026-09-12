import { NextResponse } from "next/server";
import { requireFlashMaxUser } from "@/lib/flashmax/auth";
import { getFlashMaxPaymentStatus } from "@/lib/flashmax/nowpayments";
import { applyFlashMaxPaymentEvent, type FlashMaxOrder } from "@/lib/flashmax/payments";
import { flashMaxRest } from "@/lib/flashmax/supabase";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireFlashMaxUser(request);
    const { id } = await context.params;
    const rows = await flashMaxRest<FlashMaxOrder[]>("flashmax_orders", {
      query: `?select=*&id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    });
    let order = rows[0];
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (order.provider_payment_id && !["finished", "failed", "refunded", "expired"].includes(order.status)) {
      try {
        const provider = await getFlashMaxPaymentStatus(order.provider_payment_id);
        order = (await applyFlashMaxPaymentEvent(provider)) ?? order;
      } catch {
        // The stored status remains available when provider reconciliation is temporarily unavailable.
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Status check failed.";
    return NextResponse.json({ error: message }, { status: message === "Login required." ? 401 : 500 });
  }
}
