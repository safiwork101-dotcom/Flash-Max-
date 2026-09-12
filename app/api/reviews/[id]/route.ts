import { NextResponse } from "next/server";
import { isFlashMaxAdmin } from "@/lib/flashmax/auth";
import { deleteStoredReview } from "@/lib/reviews/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isFlashMaxAdmin(request)) {
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
