"use client";

import { useState, useEffect } from "react";
import { Gift, Truck, ShieldCheck, Package, Palmtree } from "lucide-react";
import { useVacation } from "@/components/vacation/VacationProvider";
import { VACATION_REOPEN_LABEL } from "@/lib/vacation";

const defaultAnnouncements = [
  { icon: Gift, text: "Surprise in every order" },
  { icon: Truck, text: "Free shipping from €125" },
  { icon: ShieldCheck, text: "Secure payments" },
  { icon: Package, text: "Carefully packed" },
];

// Tijdens de vakantie nemen deze het hele balkje over: de gewone USP's beloven
// verzending die er even niet is.
const vacationAnnouncements = [
  { icon: Palmtree, text: `We're on holiday until ${VACATION_REOPEN_LABEL}` },
  { icon: Package, text: "Browse & fill your bag · checkout is paused" },
  { icon: Truck, text: `Orders ship again from ${VACATION_REOPEN_LABEL}` },
];

export function AnnouncementBar() {
  const onVacation = useVacation();
  const announcements = onVacation ? vacationAnnouncements : defaultAnnouncements;
  const [current, setCurrent] = useState(0);

  // De twee lijsten zijn niet even lang — begin opnieuw bij het wisselen zodat de
  // mobiele ticker nooit naar een lege positie scrollt.
  useEffect(() => {
    setCurrent(0);
  }, [onVacation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const offset = current % announcements.length;

  return (
    <div className="bg-primary text-primary-foreground">
      {/* Desktop: static row */}
      <div className="container mx-auto hidden items-center justify-between px-4 py-2 text-xs font-medium sm:flex sm:text-sm">
        {announcements.map((item) => (
          <div
            key={item.text}
            className="flex cursor-default items-center gap-1.5"
          >
            <item.icon className="h-3.5 w-3.5" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Mobile: vertical ticker, 1 visible at a time */}
      <div className="relative h-7 overflow-hidden sm:hidden">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${offset * 1.75}rem)` }}
        >
          {announcements.map((item) => (
            <div
              key={item.text}
              className="flex h-7 items-center justify-center gap-1.5 px-3 text-center text-xs font-medium"
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
