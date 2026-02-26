import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import type { EventItem } from "@/lib/sanity/events";
import { HomeEventsSlider } from "@/components/events/HomeEventsSlider";

interface EventsSectionProps {
  events?: EventItem[];
  sliderImages?: { url: string; alt?: string }[];
}

function EventCardContent({
  event,
  highlighted,
}: {
  event: EventItem;
  highlighted?: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-4">
      {/* Date block */}
      <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-center ${highlighted ? "bg-primary/10 ring-1 ring-primary" : "bg-gray-100"}`}>
        <span className="text-[10px] font-medium uppercase leading-none text-muted-foreground">
          {event.dateMonthAbbr}
        </span>
        <span className="mt-0.5 text-lg font-bold leading-none text-foreground">
          {event.dateDayDisplay}
        </span>
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-foreground">{event.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center justify-center gap-1">
        {event.logoUrl && (
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white ring-1 ring-border">
            <Image
              src={event.logoUrl}
              alt={`${event.name} logo`}
              fill
              className="object-contain p-0.5"
              sizes="40px"
            />
          </div>
        )}
        {event.link && !event.logoUrl && (
          <ExternalLink className="h-4 w-4 text-muted-foreground/50" />
        )}
        {event.link && event.logoUrl && (
          <ExternalLink className="h-3 w-3 text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "1",
    name: "Card JunkieZ",
    location: "Lommel Belgium",
    date: "1 March 2026",
    dateMonthAbbr: "Mar",
    dateDayDisplay: "1",
    isNext: true,
  },
  {
    id: "2",
    name: "Master Pultz Expo",
    location: "Sportpaleis Alkmaar Netherlands",
    date: "8 March 2026",
    dateMonthAbbr: "Mar",
    dateDayDisplay: "8",
  },
  {
    id: "3",
    name: "Card Madness, two days",
    location: "Frankfurt Germany",
    date: "2 May 2026",
    dateMonthAbbr: "May",
    dateDayDisplay: "2",
  },
];

export function EventsSection({
  events: eventsProp,
  sliderImages,
}: EventsSectionProps) {
  const events =
    eventsProp && eventsProp.length > 0 ? eventsProp : FALLBACK_EVENTS;
  const hasSlider = sliderImages && sliderImages.length > 0;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Come say hi at an event!
          </h2>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
        </div>

        {/* Two-column: slider left, events right — fixed height so they align */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Slider / fallback */}
          <div className="h-[340px] md:h-[380px]">
            {hasSlider ? (
              <HomeEventsSlider images={sliderImages} />
            ) : (
              <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple/10" />
                <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
                  <CalendarDays className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-lg font-bold text-white">
                    Meet us at card events!
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Join the V-Dub&apos;s community in person
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Events list — same fixed height, cards stretch evenly */}
          <div className="flex flex-col gap-4 md:h-[380px]">
            {events.map((event, index) => {
              const isFirstUpcoming = index === 0;
              const Wrapper = event.link ? "a" : "div";
              const wrapperProps = event.link
                ? { href: event.link, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <div key={event.id ?? index} className={`relative flex-1 rounded-lg border-2 ${
                  isFirstUpcoming
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white"
                }`}>
                  {isFirstUpcoming && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                      <CalendarDays className="h-3 w-3" />
                      Next up
                    </span>
                  )}
                  <Wrapper
                    {...wrapperProps}
                    className="flex h-full items-center p-4"
                  >
                    <EventCardContent event={event} highlighted={isFirstUpcoming} />
                  </Wrapper>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/events"
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5 active:scale-95"
          >
            View all events
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
