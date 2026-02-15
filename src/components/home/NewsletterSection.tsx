"use client";

import { useState } from "react";
import { Send, Check, Mail } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 2000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gray-900">
      {/* Soft organic washes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-300/5 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
            <Mail className="h-5 w-5 text-amber-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Never miss a drop
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-300 md:text-base">
            Sign up for our newsletter and be the first to hear about new drops,
            restocks and exclusive deals.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-md gap-3 sm:gap-0"
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-12 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 text-sm text-white placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:rounded-r-none sm:border-r-0"
              />
            </div>
            <button
              type="submit"
              disabled={submitted}
              className={`flex h-12 shrink-0 items-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm transition-all active:scale-[0.97] sm:rounded-l-none ${
                submitted
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-gray-900 hover:bg-amber-400"
              }`}
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Subscribed!</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
