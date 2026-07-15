"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "region_notice_dismissed_us";
const NOTICE_COUNTRY = "US";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * One-time notice for US visitors: the shop ships EU-only. Country comes from the
 * `visitor_country` cookie set by middleware (Vercel/Cloudflare geo). Dismissal is
 * remembered in localStorage so it shows at most once per visitor.
 */
export function RegionNoticeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* ignore storage errors */
    }
    if (getCookie("visitor_country") === NOTICE_COUNTRY) {
      setShow(true);
    }
  }, []);

  // Lock scroll + close on Escape while open.
  useEffect(() => {
    if (!show) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-notice-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pb-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-3xl">
            🌍
          </div>
          <h2
            id="region-notice-title"
            className="text-xl font-bold text-foreground"
          >
            Welcome to V-Dub&apos;s!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We are currently focusing on serving our collectors within the
            European Union. While you are welcome to browse our collection,
            please note that we do not currently ship orders to the United
            States.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            Thank you for your understanding!
          </p>

          <button
            type="button"
            onClick={dismiss}
            className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:scale-[0.99]"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
