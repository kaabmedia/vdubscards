/**
 * Vakantiemodus — de shop is te browsen, maar afrekenen staat uit.
 *
 * De periode staat hier hard in de code (bewuste keuze: geen env-vars, geen CMS).
 * De instants staan als UTC genoteerd omdat de shop in Europe/Amsterdam draait maar
 * servers in UTC: 1 sep 2026 00:00 CEST = 2026-08-31T22:00Z, 1 okt 2026 00:00 CEST =
 * 2026-09-30T22:00Z. Het einde is exclusief, dus op 1 oktober 00:00 kan er weer
 * afgerekend worden.
 *
 * Wil je de vakantie eerder beëindigen? Zet VACATION_END op een eerder moment (of
 * VACATION_START gelijk aan VACATION_END) en deploy.
 */
export const VACATION_START = new Date("2026-08-31T22:00:00.000Z");
export const VACATION_END = new Date("2026-09-30T22:00:00.000Z");

/** Staat de shop op dit moment in vakantiemodus? Einde is exclusief. */
export function isVacationActive(now: Date | number = Date.now()): boolean {
  const t = typeof now === "number" ? now : now.getTime();
  return t >= VACATION_START.getTime() && t < VACATION_END.getTime();
}

function formatAmsterdam(date: Date, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam",
    ...opts,
  }).format(date);
}

/** "1 September" — eerste dag dat afrekenen uitstaat. */
export const VACATION_FROM_LABEL = formatAmsterdam(VACATION_START, {
  day: "numeric",
  month: "long",
});

/**
 * "30 September" — laatste dag van de vakantie. VACATION_END is exclusief, dus we
 * pakken de dag ervoor zodat de tekst niet suggereert dat 1 oktober nog dicht is.
 */
export const VACATION_UNTIL_LABEL = formatAmsterdam(
  new Date(VACATION_END.getTime() - 86_400_000),
  { day: "numeric", month: "long" }
);

/** "1 October" — eerste dag dat er weer afgerekend en verzonden wordt. */
export const VACATION_REOPEN_LABEL = formatAmsterdam(VACATION_END, {
  day: "numeric",
  month: "long",
});

/** Sleutel voor localStorage; verandert mee met de periode zodat een nieuwe vakantie de melding opnieuw toont. */
export const VACATION_DISMISS_KEY = `vacation_notice_dismissed_${VACATION_START.toISOString().slice(0, 10)}`;

/**
 * Alle klantgerichte teksten op één plek. De storefront is volledig Engelstalig,
 * dus deze teksten ook.
 */
export const VACATION_COPY = {
  heading: "We're on holiday",
  checkoutBlocked: `Checkout is paused until ${VACATION_REOPEN_LABEL}.`,
  bagSaved: `You're welcome to keep filling your bag in the meantime — we start taking and shipping orders again on ${VACATION_REOPEN_LABEL}.`,
  productNote: `You can still add this to your bag — checkout reopens ${VACATION_REOPEN_LABEL}.`,
  modalTitle: "We're on holiday",
  modalBody: `V-Dub's is taking a break from ${VACATION_FROM_LABEL} to ${VACATION_UNTIL_LABEL}. You're very welcome to browse the full collection and fill your bag, but checkout is switched off and no orders are shipped during this period.`,
  modalClosing: `We're back — and shipping again — on ${VACATION_REOPEN_LABEL}. Thanks for your patience!`,
  modalCta: "Continue browsing",
  shipsFrom: `Ships from ${VACATION_REOPEN_LABEL}`,
} as const;
