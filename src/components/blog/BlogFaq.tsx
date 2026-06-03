"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/sanity/blog";

interface BlogFaqProps {
  items: FaqItem[];
}

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold leading-snug text-gray-900 md:text-base">
          {item.question}
        </span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[600px] pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
      </div>
    </div>
  );
}

export function BlogFaq({ items }: BlogFaqProps) {
  if (!items?.length) return null;

  return (
    <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">❓</span>
        <h2 className="text-lg font-bold text-gray-900 md:text-xl">
          Frequently Asked Questions
        </h2>
      </div>
      <p className="mb-5 text-sm text-gray-500">
        Quick answers to common questions about this topic.
      </p>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {items.map((item, i) => (
          <FaqAccordionItem key={item._key} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
