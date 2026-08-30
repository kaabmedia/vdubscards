"use client";

import { Palmtree } from "lucide-react";
import { VACATION_COPY } from "@/lib/vacation";

/**
 * Vervangt de Checkout-knop in de cart drawer en op /cart zolang de shop met
 * vakantie is. Bewust géén knop: er valt niets te klikken, dus we tonen alleen
 * uitleg zodat niemand op een dood element klikt.
 */
export function VacationCheckoutNotice({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-primary/40 bg-primary/10 p-4 ${className}`}
      role="status"
    >
      <div className="flex items-start gap-2.5">
        <Palmtree className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {VACATION_COPY.heading}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {VACATION_COPY.checkoutBlocked} {VACATION_COPY.bagSaved}
          </p>
        </div>
      </div>
    </div>
  );
}
