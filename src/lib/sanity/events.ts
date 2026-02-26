import { sanityClient } from "./client";

export interface EventItem {
  id: string;
  name: string;
  location: string;
  date: string;
  /** Maandafkorting voor de kaart (bv. Jan, Feb) */
  dateMonthAbbr: string;
  /** Dag(bereik) voor de kaart (bv. 1 of 1–15) */
  dateDayDisplay: string;
  startDate?: string;
  endDate?: string;
  link?: string;
  isNext?: boolean;
  logoUrl?: string;
}

function formatDateRange(startDate: string | undefined, endDate: string | undefined): string {
  if (!startDate) return "";
  const start = new Date(startDate);
  const startStr = start.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (!endDate) return startStr;
  const end = new Date(endDate);
  const endStr = end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (startStr === endStr) return startStr;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${startStr} – ${endStr}`;
}

function getDateMonthAbbr(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short" });
}

function getDateCardDisplay(
  startDate: string | undefined,
  endDate: string | undefined
): { monthAbbr: string; dayDisplay: string } {
  if (!startDate) return { monthAbbr: "", dayDisplay: "" };
  const start = new Date(startDate);
  const monthAbbr = getDateMonthAbbr(start);
  if (!endDate) {
    return { monthAbbr, dayDisplay: String(start.getDate()) };
  }
  const end = new Date(endDate);
  if (start.getDate() === end.getDate() && start.getMonth() === end.getMonth()) {
    return { monthAbbr, dayDisplay: String(start.getDate()) };
  }
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return { monthAbbr, dayDisplay: `${start.getDate()}–${end.getDate()}` };
  }
  return { monthAbbr, dayDisplay: `${start.getDate()}+` };
}

const EVENTS_QUERY = `*[_type == "event"] | order(sortOrder asc, startDate asc) {
  _id,
  name,
  location,
  startDate,
  endDate,
  link,
  isNext,
  "logoUrl": logo.asset->url
}`;

export async function getEvents(): Promise<EventItem[]> {
  if (!sanityClient) return [];

  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string;
      name: string;
      location: string;
      startDate?: string;
      endDate?: string;
      link?: string;
      isNext?: boolean;
      logoUrl?: string;
    }>>(EVENTS_QUERY);

    const events: EventItem[] = docs
      .filter((doc) => doc.startDate)
      .map((doc) => {
        const card = getDateCardDisplay(doc.startDate, doc.endDate);
        return {
          id: doc._id,
          name: doc.name ?? "Event",
          location: doc.location ?? "",
          date: formatDateRange(doc.startDate, doc.endDate),
          dateMonthAbbr: card.monthAbbr,
          dateDayDisplay: card.dayDisplay,
          startDate: doc.startDate ?? undefined,
          endDate: doc.endDate ?? undefined,
          link: doc.link ?? undefined,
          isNext: doc.isNext ?? false,
          logoUrl: doc.logoUrl ?? undefined,
        };
      });

    // Markeer eerste als "next" als er geen expliciet is gezet
    const hasExplicitNext = events.some((e) => e.isNext);
    if (!hasExplicitNext && events.length > 0) {
      events[0].isNext = true;
    }

    return events;
  } catch {
    return [];
  }
}

/** Bepaal of een event nog aankomend is (niet voorbij) */
function isUpcoming(event: EventItem): boolean {
  const endOfEvent = event.endDate ?? event.startDate;
  if (!endOfEvent) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(endOfEvent) >= today;
}

/** Eerste N aankomende events (voor homepage) */
export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
  const all = await getEvents();
  const upcoming = all.filter(isUpcoming);
  return upcoming.slice(0, limit);
}

/** Events opgesplitst in aankomend en voorbij (voor events-pagina) */
export async function getEventsSplit(): Promise<{
  upcoming: EventItem[];
  past: EventItem[];
}> {
  const all = await getEvents();
  const upcoming = all.filter(isUpcoming);
  const past = all.filter((e) => !isUpcoming(e)).reverse(); // meest recente voorbij eerst
  return { upcoming, past };
}
