"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useVacation } from "@/components/vacation/VacationProvider";
import {
  REGION_DISMISS_KEY,
  REGION_NOTICE_COUNTRY,
} from "@/components/layout/RegionNoticeModal";
import { VACATION_COPY, VACATION_DISMISS_KEY } from "@/lib/vacation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Zou de bestaande US-regiomelding deze pageview claimen? Dan wachten wij een bezoek. */
function regionNoticeWillShow(): boolean {
  try {
    if (localStorage.getItem(REGION_DISMISS_KEY)) return false;
  } catch {
    return false;
  }
  return getCookie("visitor_country") === REGION_NOTICE_COUNTRY;
}

/**
 * Eenmalige melding dat de shop met vakantie is. Zelfde patroon als
 * RegionNoticeModal: dismissal in localStorage, dus maximaal één keer per bezoeker.
 * De sleutel bevat de startdatum van de periode, zodat een volgende vakantie de
 * melding weer laat zien.
 */
export function VacationNoticeModal() {
  const onVacation = useVacation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!onVacation) return;
    try {
      if (localStorage.getItem(VACATION_DISMISS_KEY)) return;
    } catch {
      /* geen storage (privémodus) — dan tonen we hem gewoon */
    }
    // Nooit stapelen op de US-regiomelding.
    if (regionNoticeWillShow()) return;
    setShow(true);
  }, [onVacation]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(VACATION_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
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
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vacation-notice-title"
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
            🌴
          </div>
          <h2
            id="vacation-notice-title"
            className="text-xl font-bold text-foreground"
          >
            {VACATION_COPY.modalTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {VACATION_COPY.modalBody}
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            {VACATION_COPY.modalClosing}
          </p>

          <button
            type="button"
            onClick={dismiss}
            className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 active:scale-[0.99]"
          >
            {VACATION_COPY.modalCta}
          </button>
        </div>
      </div>
    </div>
  );
}
