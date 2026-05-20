"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageSquare, Send, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/src/config/siteConfig";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadReviews();
  }, []);

  async function loadReviews() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", { cache: "no-store" });
      const data = (await response.json()) as { reviews?: Review[] };
      setReviews(data.reviews ?? []);
    } catch {
      setError("Reviews could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !text.trim()) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text }),
      });

      if (!response.ok) {
        throw new Error("Review could not be saved.");
      }

      const data = (await response.json()) as { review: Review };
      setReviews((currentReviews) => [data.review, ...currentReviews]);
      setName("");
      setText("");
      setRating(5);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setError("Review could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section id="reviews" className="scroll-mt-28 pb-24">
      <div className="mx-auto w-[min(100%-32px,760px)]">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-black tracking-[0.22em] text-white/38">
            {siteConfig.generator.reviews.eyebrow}
          </p>
          <h2 className="text-3xl font-black text-white">
            {siteConfig.generator.reviews.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/52">
            {siteConfig.generator.reviews.intro}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-line bg-panel/95 p-5 shadow-glow"
          >
            <h3 className="mb-5 flex items-center gap-3 text-lg font-black text-white">
              <MessageSquare className="size-5 text-mint" />
              Add Review
            </h3>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-white/62">
                {siteConfig.generator.reviews.nameLabel}
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={siteConfig.generator.reviews.namePlaceholder}
                maxLength={40}
                className="h-12 w-full rounded-lg border border-line bg-night/80 px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-mint"
              />
            </label>

            <div className="mt-5">
              <span className="mb-2 block text-sm font-black text-white/62">
                {siteConfig.generator.reviews.ratingLabel}
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star rating`}
                    className="grid size-10 place-items-center rounded-lg border border-line bg-night/80 transition hover:border-mint"
                  >
                    <Star
                      className={cn(
                        "size-5",
                        value <= rating
                          ? "fill-ember text-ember"
                          : "text-white/24",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black text-white/62">
                {siteConfig.generator.reviews.reviewLabel}
              </span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={siteConfig.generator.reviews.reviewPlaceholder}
                maxLength={320}
                rows={5}
                className="w-full resize-none rounded-lg border border-line bg-night/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-mint"
              />
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 text-sm font-black text-night shadow-button transition hover:bg-aqua"
            >
              <Send className="size-4" />
              {isSaving ? "Saving..." : siteConfig.generator.reviews.submitLabel}
            </button>

            {saved ? (
              <p className="mt-4 rounded-lg border border-mint/25 bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">
                {siteConfig.generator.reviews.savedMessage}
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                {error}
              </p>
            ) : null}
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-lg border border-line bg-panel/90 p-5 text-sm text-white/52">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-lg border border-line bg-panel/90 p-5 text-sm text-white/52">
                {siteConfig.generator.reviews.emptyMessage}
              </div>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border border-line bg-panel/90 p-5 transition duration-200 hover:-translate-y-1 hover:border-mint/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-white">{review.name}</h3>
                      <p className="mt-1 text-xs font-semibold text-white/36">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex gap-1">
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
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    {review.text}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
