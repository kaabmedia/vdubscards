"use client";

import { Palmtree } from "lucide-react";
import { useVacation } from "@/components/vacation/VacationProvider";
import { VACATION_COPY } from "@/lib/vacation";

/**
 * Kleine notitie onder de "Add to bag"-knop op de productpagina. Toevoegen aan de
 * mand mag gewoon door tijdens de vakantie — alleen afrekenen niet — dus dit is
 * puur een verwachting-scheppende regel, geen blokkade.
 */
export function VacationProductNotice() {
  const onVacation = useVacation();
  if (!onVacation) return null;

  return (
    <p className="mt-3 flex items-start gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
      <Palmtree className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
      <span>
        <span className="font-semibold text-foreground">
          {VACATION_COPY.heading}.
        </span>{" "}
        {VACATION_COPY.productNote}
      </span>
    </p>
  );
}
