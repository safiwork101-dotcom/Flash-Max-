import { NextResponse } from "next/server";
import { deleteStoredReview } from "@/lib/reviews/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const adminSecret = "chotiluli123";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const providedKey = request.headers.get("x-admin-key");

  if (!providedKey || providedKey !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  if (id.startsWith("default-")) {
    return NextResponse.json(
      { error: "Default reviews are edited in siteConfig.ts." },
      { status: 400 },
    );
  }

  const deleted = await deleteStoredReview(id);
  return NextResponse.json({ deleted });
}
