"use client";

import { useState, useEffect } from "react";
import { Gift, Truck, ShieldCheck, Package } from "lucide-react";

const announcements = [
  { icon: Gift, text: "Surprise in every order" },
  { icon: Truck, text: "Free shipping from €125" },
  { icon: ShieldCheck, text: "Secure payments" },
  { icon: Package, text: "Carefully packed" },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

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
      <div className="relative h-8 overflow-hidden sm:hidden">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${current * 2}rem)` }}
        >
          {announcements.map((item) => (
            <div
              key={item.text}
              className="flex h-8 items-center justify-center gap-1.5 text-xs font-medium"
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
