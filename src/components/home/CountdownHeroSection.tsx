"use client";

import { useState, useEffect } from "react";

interface CountdownHeroSectionProps {
  endDate: string;
  headline: string;
  description: string;
  backgroundMobile?: string | null;
  backgroundTablet?: string | null;
  backgroundDesktop?: string | null;
}

function useCountdown(endDate: string) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    done: boolean;
  } | null>(null);

  useEffect(() => {
    const target = new Date(endDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, done: false });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}

export function CountdownHeroSection({
  endDate,
  headline,
  description,
  backgroundMobile,
  backgroundTablet,
  backgroundDesktop,
}: CountdownHeroSectionProps) {
  const timeLeft = useCountdown(endDate);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const hasBackground =
    backgroundMobile || backgroundTablet || backgroundDesktop;

  return (
    <section className="relative min-h-[400px] overflow-hidden bg-gray-900 md:min-h-[480px]">
      {/* Responsive background images (fallback: desktop -> tablet -> mobile) */}
      {(backgroundMobile || backgroundTablet || backgroundDesktop) && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{
              backgroundImage: `url(${backgroundMobile || backgroundTablet || backgroundDesktop})`,
            }}
          />
          {(backgroundTablet || backgroundDesktop) && (
            <div
              className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block lg:hidden"
              style={{
                backgroundImage: `url(${backgroundTablet || backgroundDesktop})`,
              }}
            />
          )}
          {backgroundDesktop && (
            <div
              className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
              style={{
                backgroundImage: `url(${backgroundDesktop})`,
              }}
            />
          )}
        </>
      )}

      {/* Dark overlay when background image is used */}
      {hasBackground && (
        <div className="absolute inset-0 bg-gray-900/70" />
      )}

      {/* Subtle particle effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative mx-auto flex min-h-[400px] flex-col items-center px-4 py-16 md:min-h-[480px] md:flex-row md:flex-nowrap md:items-center md:justify-between md:gap-12 md:py-20">
        {/* Left: headline + form */}
        <div className="z-10 flex flex-1 flex-col md:max-w-md">
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {headline}
          </h1>
          <p className="mt-4 text-gray-300">{description}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-sm gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={submitted}
              className="h-12 flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={submitted}
              className="h-12 shrink-0 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-default disabled:bg-emerald-600 disabled:text-white"
            >
              {submitted ? "Subscribed!" : "Notify me"}
            </button>
          </form>
        </div>

        {/* Right: countdown */}
        <div className="z-10 mt-12 flex flex-wrap justify-center gap-6 md:mt-0 md:gap-10">
          {timeLeft?.done ? (
            <p className="text-xl font-semibold text-white">Drop is live!</p>
          ) : timeLeft ? (
            <>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white md:text-5xl">
                  {String(timeLeft.days).padStart(3, "0")}
                </span>
                <span className="mt-1 text-xs font-medium uppercase text-gray-400">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white md:text-5xl">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xs font-medium uppercase text-gray-400">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white md:text-5xl">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xs font-medium uppercase text-gray-400">
                  Minutes
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-white md:text-5xl">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xs font-medium uppercase text-gray-400">
                  Seconds
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-20 items-center justify-center">
              <span className="text-gray-500">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
