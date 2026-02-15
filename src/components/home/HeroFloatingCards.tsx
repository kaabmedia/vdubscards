import Link from "next/link";
import Image from "next/image";

const HERO_CARD_POSITIONS = [
  { className: "rotate-[-8deg] shrink-0", opacity: "opacity-90" },
  { className: "rotate-[5deg] shrink-0", opacity: "opacity-85" },
  { className: "rotate-[8deg] shrink-0", opacity: "opacity-90" },
  { className: "rotate-[-5deg] shrink-0", opacity: "opacity-85" },
] as const;

export interface FloatingCard {
  url: string;
  alt?: string;
  href?: string;
}

interface HeroFloatingCardsProps {
  cards: FloatingCard[];
  /** Light theme: opacity/grayscale for light hero. Dark theme: lighter opacity for dark countdown hero. */
  theme?: "light" | "dark";
}

function CardSlot({ index, card, theme }: { index: number; card: FloatingCard; theme: "light" | "dark" }) {
  const { className, opacity } = HERO_CARD_POSITIONS[index];
  const opacityClass = theme === "dark" ? "opacity-40" : opacity;
  const wrapperClass = `block relative w-36 h-48 md:w-48 md:h-64 shrink-0 ${className} ${opacityClass} overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25 hover:z-50 hover:opacity-100 ${card.href ? "cursor-pointer pointer-events-auto" : "cursor-default pointer-events-auto"}`;
  const content = (
    <Image
      src={card.url}
      alt={card.alt ?? "Card"}
      fill
      className="object-cover scale-110"
      sizes="192px"
    />
  );
  if (card.href) {
    return (
      <Link href={card.href} className={wrapperClass}>
        {content}
      </Link>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}

const LIGHT_GRADIENTS = [
  "from-blue-600 to-purple-700",
  "from-yellow-500 to-orange-600",
  "from-red-500 to-red-700",
  "from-green-500 to-teal-600",
];

const DARK_GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-cyan-400 to-blue-600",
  "from-rose-400 to-pink-600",
  "from-emerald-400 to-teal-600",
];

function PlaceholderSlot({
  index,
  theme,
}: {
  index: number;
  theme: "light" | "dark";
}) {
  const { className, opacity } = HERO_CARD_POSITIONS[index];
  const gradient = theme === "dark" ? DARK_GRADIENTS[index] : LIGHT_GRADIENTS[index];
  return (
    <div className={`w-36 h-48 md:w-48 md:h-64 shrink-0 ${className} pointer-events-none rounded-lg bg-gradient-to-br shadow-2xl ${gradient} ${opacity}`} />
  );
}

export function HeroFloatingCards({ cards, theme = "light" }: HeroFloatingCardsProps) {
  return (
    <>
      <div className="absolute left-2 top-[107px] z-40 hidden flex-row gap-0 md:left-4 md:top-[115px] min-[1300px]:flex">
        {cards[0] ? (
          <CardSlot index={0} card={cards[0]} theme={theme} />
        ) : (
          <PlaceholderSlot index={0} theme={theme} />
        )}
        {cards[1] ? (
          <CardSlot index={1} card={cards[1]} theme={theme} />
        ) : (
          <PlaceholderSlot index={1} theme={theme} />
        )}
      </div>
      <div className="absolute right-2 top-[107px] z-40 hidden flex-row gap-0 md:right-4 md:top-[115px] min-[1300px]:flex">
        {cards[2] ? (
          <CardSlot index={2} card={cards[2]} theme={theme} />
        ) : (
          <PlaceholderSlot index={2} theme={theme} />
        )}
        {cards[3] ? (
          <CardSlot index={3} card={cards[3]} theme={theme} />
        ) : (
          <PlaceholderSlot index={3} theme={theme} />
        )}
      </div>
    </>
  );
}
