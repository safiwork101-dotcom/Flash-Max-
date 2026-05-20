import { NextResponse } from "next/server";
import { addStoredReview, readStoredReviews } from "@/lib/reviews/store";
import { siteConfig } from "@/src/config/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const storedReviews = await readStoredReviews();
  const defaultReviews = siteConfig.generator.reviews.defaultReviews.map(
    (review, index) => ({
      ...review,
      id: `default-${index}`,
      createdAt: "",
    }),
  );

  return NextResponse.json({ reviews: [...storedReviews, ...defaultReviews] });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { name?: unknown; rating?: unknown; text?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name : "";
  const text = typeof body?.text === "string" ? body.text : "";
  const rating =
    typeof body?.rating === "number" ? body.rating : Number(body?.rating ?? 5);

  if (!name.trim() || !text.trim()) {
    return NextResponse.json(
      { error: "Name and review are required." },
      { status: 400 },
    );
  }

  const review = await addStoredReview({ name, rating, text });
  return NextResponse.json({ review }, { status: 201 });
}
