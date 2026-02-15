import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getEventsSplit, type EventItem } from "@/lib/sanity/events";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Events | V-Dub's Cards",
  description:
    "Find V-Dub's Cards at card events, markets and expos across Europe. Come say hi!",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { upcoming, past } = await getEventsSplit();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Events
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Come say hi at an event! We regularly visit card fairs, markets and
            expos across Europe. Check where we&apos;ll be next.
          </p>
        </div>

        {/* Upcoming events */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Upcoming events
          </h2>
          {upcoming.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600">
                No upcoming events. Check back soon or follow us on social
                media for updates!
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
              >
                Contact for event info
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>

        {/* Past events */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Past events
          </h2>
          {past.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} muted />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No past events yet.
            </p>
          )}
        </section>

        <div className="mt-10">
          <Link
            href="/collections/all"
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5 active:scale-95"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover/btn:-translate-x-1" />
            Back to shop
          </Link>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}

function EventCard({
  event,
  muted,
}: {
  event: EventItem;
  index: number;
  muted?: boolean;
}) {
  const isNext = event.isNext && !muted;
  const Wrapper = event.link ? "a" : "div";
  const wrapperProps = event.link
    ? { href: event.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div className={`relative rounded-lg border ${
      isNext
        ? "border-amber-400 bg-amber-50/30"
        : "border-gray-200 bg-white"
    } ${muted ? "opacity-60" : ""}`}>
      {isNext && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          <CalendarDays className="h-3 w-3" />
          Next up
        </span>
      )}
      <Wrapper
        {...wrapperProps}
        className="flex items-center gap-4 p-5"
      >
        {/* Date block */}
        <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg text-center ${isNext ? "bg-amber-50 ring-1 ring-amber-300" : muted ? "bg-gray-50" : "bg-gray-100"}`}>
          <span className="text-[11px] font-medium uppercase leading-none text-muted-foreground">
            {event.dateMonthAbbr}
          </span>
          <span className="mt-0.5 text-xl font-bold leading-none text-foreground">
            {event.dateDayDisplay}
          </span>
        </div>
        {/* Info */}
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-gray-900">{event.name}</h2>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.location}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {event.date}
          </div>
        </div>
        {event.link && (
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        )}
      </Wrapper>
    </div>
  );
}
