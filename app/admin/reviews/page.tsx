"use client";

import { FormEvent, useEffect, useState } from "react";
import { Trash2, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export default function AdminReviewsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    const response = await fetch("/api/reviews", { cache: "no-store" });
    const data = (await response.json()) as { reviews?: Review[] };
    setReviews(data.reviews ?? []);
    setIsLoading(false);
  }

  async function deleteReview(id: string) {
    setMessage("");

    const response = await fetch(`/api/reviews/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      deleted?: boolean;
    };

    if (!response.ok) {
      setMessage(data.error ?? "Could not delete review.");
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.filter((review) => review.id !== id),
    );
    setMessage(data.deleted ? "Review deleted." : "Review was not found.");
  }

  function handleKeySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(adminKey ? "Admin key ready." : "Enter the admin key.");
  }

  return (
    <main className="min-h-screen bg-night px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <p className="mb-3 text-xs font-black tracking-[0.22em] text-white/38">
            ADMIN
          </p>
          <h1 className="flex items-center gap-3 text-3xl font-black">
            <ShieldCheck className="size-7 text-mint" />
            Review Moderation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/54">
            Enter your admin key, then delete any user-submitted review you do
            not want to show on the website. Default reviews are edited in
            siteConfig.ts.
          </p>
        </div>

        <form
          onSubmit={handleKeySubmit}
          className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-panel/90 p-4 sm:flex-row"
        >
          <input
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="Admin key"
            type="password"
            className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-night/80 px-4 text-sm text-white outline-none focus:border-mint"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-mint px-5 text-sm font-black text-night"
          >
            Use Key
          </button>
        </form>

        {message ? (
          <p className="mb-5 rounded-lg border border-line bg-panel/90 px-4 py-3 text-sm text-white/70">
            {message}
          </p>
        ) : null}

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-lg border border-line bg-panel/90 p-5 text-sm text-white/54">
              Loading reviews...
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-lg border border-line bg-panel/90 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-black">{review.name}</h2>
                    <p className="mt-1 text-xs text-white/38">{review.date}</p>
                    <div className="mt-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={cn(
                            "size-4",
                            value <= review.rating
                              ? "fill-ember text-ember"
                              : "text-white/20",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={review.id.startsWith("default-")}
                    onClick={() => void deleteReview(review.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-coral/30 px-4 text-sm font-black text-coral transition hover:bg-coral/10 disabled:cursor-not-allowed disabled:border-line disabled:text-white/24"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/62">
                  {review.text}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
