import { NextResponse } from "next/server";
import { deleteStoredReview } from "@/lib/reviews/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminKey = process.env.REVIEWS_ADMIN_KEY;
  const providedKey = request.headers.get("x-admin-key");

  if (!adminKey) {
    return NextResponse.json(
      { error: "REVIEWS_ADMIN_KEY is not configured." },
      { status: 500 },
    );
  }

  if (!providedKey || providedKey !== adminKey) {
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
