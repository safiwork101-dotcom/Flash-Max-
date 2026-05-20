import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

export type StoredReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  createdAt: string;
};

const dataDirectory = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL
    ? path.join(os.tmpdir(), "flash-max-data")
    : path.join(process.cwd(), "data");
const reviewsFilePath = path.join(dataDirectory, "reviews.json");

async function ensureReviewsFile() {
  await fs.mkdir(path.dirname(reviewsFilePath), { recursive: true });

  try {
    await fs.access(reviewsFilePath);
  } catch {
    await fs.writeFile(reviewsFilePath, "[]", "utf8");
  }
}

export async function readStoredReviews(): Promise<StoredReview[]> {
  await ensureReviewsFile();
  const file = await fs.readFile(reviewsFilePath, "utf8");

  try {
    const parsed = JSON.parse(file) as StoredReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addStoredReview(input: {
  name: string;
  rating: number;
  text: string;
}): Promise<StoredReview> {
  const reviews = await readStoredReviews();
  const now = new Date();
  const review: StoredReview = {
    id: `review-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeText(input.name, 40),
    rating: clampRating(input.rating),
    text: sanitizeText(input.text, 320),
    date: now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    createdAt: now.toISOString(),
  };

  const nextReviews = [review, ...reviews].slice(0, 200);
  await fs.writeFile(reviewsFilePath, JSON.stringify(nextReviews, null, 2), "utf8");
  return review;
}

export async function deleteStoredReview(id: string) {
  const reviews = await readStoredReviews();
  const nextReviews = reviews.filter((review) => review.id !== id);
  await fs.writeFile(reviewsFilePath, JSON.stringify(nextReviews, null, 2), "utf8");
  return nextReviews.length !== reviews.length;
}

function sanitizeText(value: string, maxLength: number) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function clampRating(value: number) {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.min(5, Math.max(1, Math.round(value)));
}
