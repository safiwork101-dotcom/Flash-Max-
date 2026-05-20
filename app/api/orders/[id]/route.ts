import { NextResponse } from "next/server";
import { deleteStoredOrder } from "@/lib/orders/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminKey = request.headers.get("x-admin-key") ?? "";

  if (adminKey !== process.env.REVIEWS_ADMIN_KEY) {
    return NextResponse.json({ error: "Invalid admin key." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteStoredOrder(id);
  return NextResponse.json({ deleted });
}
