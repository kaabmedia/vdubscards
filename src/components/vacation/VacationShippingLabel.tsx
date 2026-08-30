"use client";

import { useVacation } from "@/components/vacation/VacationProvider";
import { VACATION_COPY } from "@/lib/vacation";

/**
 * Vervangt een verzendbelofte ("Shipped within 1-3 days") door de eerste dag dat er
 * weer verzonden wordt. Zit in een client-component zodat de server-gerenderde
 * productpagina alleen dit ene label hoeft af te staan.
 */
export function VacationShippingLabel({ normal }: { normal: string }) {
  const onVacation = useVacation();
  return <>{onVacation ? VACATION_COPY.shipsFrom : normal}</>;
}
