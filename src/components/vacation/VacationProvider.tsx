"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isVacationActive } from "@/lib/vacation";

const VacationContext = createContext<boolean>(false);

/**
 * Levert de vakantiestatus aan alle client-componenten.
 *
 * `initialActive` wordt op de server berekend en meegegeven door de root layout.
 * Daardoor rendert de server-HTML en de hydratie exact hetzelfde (geen hydration
 * mismatch), óók als de pagina statisch gecachet is. Direct na hydratie herrekenen
 * we op de klok van de bezoeker, zodat een pagina die vóór de vakantie is gecachet
 * zichzelf alsnog corrigeert. Daarna checken we elke minuut, zodat een tabblad dat
 * over de grens van 1 sep of 1 okt heen blijft staan vanzelf omklapt.
 */
export function VacationProvider({
  initialActive,
  children,
}: {
  initialActive: boolean;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    const check = () => setActive(isVacationActive());
    check();
    const timer = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return (
    <VacationContext.Provider value={active}>
      {children}
    </VacationContext.Provider>
  );
}

/** True zolang de shop in vakantiemodus staat (browsen mag, afrekenen niet). */
export function useVacation(): boolean {
  return useContext(VacationContext);
}
