"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/src/config/siteConfig";

const storageKey = "brand-site-notice-accepted";

export function NoticeModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(storageKey) !== "true") {
      setIsVisible(true);
    }
  }, []);

  function acceptNotice() {
    window.localStorage.setItem(storageKey, "true");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 backdrop-blur-sm">
      <div className="glass-card relative w-full max-w-2xl rounded-lg p-6 shadow-2xl md:p-8">
        <button
          type="button"
          aria-label="Close notice"
          onClick={acceptNotice}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <X className="size-4" />
        </button>

        <div className="mb-6 flex items-center gap-3 pr-10">
          <AlertTriangle className="size-7 text-ember" />
          <h2 className="text-2xl font-black text-ember">
            {siteConfig.notice.title}
          </h2>
        </div>

        <p className="mb-5 text-sm font-semibold leading-7 text-white/86">
          {siteConfig.notice.intro}
        </p>

        <div className="space-y-4">
          {siteConfig.notice.points.map((point, index) => (
            <p key={point.label} className="text-sm leading-7 text-white/60">
              <span className="font-black text-white">
                {index + 1}. {point.label}:
              </span>{" "}
              {point.text}
            </p>
          ))}
        </div>

        <p className="mt-6 text-sm font-black leading-7 text-coral">
          {siteConfig.notice.warning}
        </p>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={acceptNotice}
            className="min-h-11 rounded-lg bg-aqua px-6 text-sm font-black text-night shadow-button transition hover:bg-mint"
          >
            {siteConfig.notice.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
