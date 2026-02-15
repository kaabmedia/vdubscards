import Link from "next/link";
import { HeroFloatingCards, type FloatingCard } from "./HeroFloatingCards";

interface HeroSectionProps {
  floatingCards?: FloatingCard[];
}

export function HeroSection({ floatingCards = [] }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        filter: "saturate(115%)",
        background:
          "radial-gradient(80rem 80rem at 12% 12%, #ffd68294, #0000 44%), radial-gradient(60rem 60rem at 88% 10%, #7c3aed61, #0000 46%), radial-gradient(50rem 50rem at 16% 78%, #ffd6825c, #0000 48%), radial-gradient(38rem 38rem at 78% 74%, #7c3aed4d, #0000 52%), conic-gradient(from 200deg at 50% 40%, #ffd68242, #7c3aed2e, #ffd68252, #7c3aed24, #ffd68242), linear-gradient(#fff7d1f5, #ffeeaaeb)",
      }}
    >
      <HeroFloatingCards cards={floatingCards} theme="light" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-[200px] pt-16 text-center md:pb-[200px] md:pt-24">
        <h1 className="mx-auto max-w-lg text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          One of Europe&apos;s Largest Single-Card Marketplaces
        </h1>
        <Link
          href="/collections/all"
          className="group mt-8 inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 active:scale-95"
        >
          Shop Now
        </Link>

      </div>

      {/* Eagle mascot – bottom center, fully inside hero */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-[50] flex justify-center animate-mascot-pop"
        style={{ marginLeft: -104, marginTop: -20, marginBottom: -20, transform: "translateX(-50%) translateY(-40px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot-eagle.png"
          alt=""
          className="block h-auto w-40 md:w-52"
        />
      </div>
    </section>
  );
}
