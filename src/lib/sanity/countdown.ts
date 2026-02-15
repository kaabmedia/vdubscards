import { sanityClient } from "./client";
import { urlFor } from "./image";

export interface CountdownSettings {
  enabled: boolean;
  endDate: string | null;
  headline: string;
  description: string;
  backgroundMobile: string | null;
  backgroundTablet: string | null;
  backgroundDesktop: string | null;
}

export interface NewDropSettings {
  enabled: boolean;
  imageUrl: string | null;
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export interface EventsSliderSettings {
  enabled: boolean;
  images: { url: string; alt?: string }[];
}

export interface HomeSettings {
  countdown: CountdownSettings;
  heroFloatingCardsSource: "custom" | "products";
  heroFloatingCards: { url: string; alt?: string }[];
  newDrop: NewDropSettings;
  eventsSlider: EventsSliderSettings;
}

const HOME_QUERY = `*[_type == "countdown"][0] {
  enabled,
  endDate,
  headline,
  description,
  backgroundMobile,
  backgroundTablet,
  backgroundDesktop,
  heroFloatingCardsSource,
  heroFloatingCards,
  newDropEnabled,
  newDropImage,
  newDropTitle,
  newDropText,
  newDropButtonText,
  newDropButtonLink,
  eventsSliderImages
}`;

function imageUrl(source: { _type?: string; asset?: { _ref: string } } | null | undefined): string | null {
  if (!source?.asset) return null;
  try {
    return urlFor(source).url();
  } catch {
    return null;
  }
}

export async function getHomeSettings(): Promise<HomeSettings> {
  const emptyCountdown: CountdownSettings = {
    enabled: false,
    endDate: null,
    headline: "",
    description: "",
    backgroundMobile: null,
    backgroundTablet: null,
    backgroundDesktop: null,
  };

  const emptyNewDrop: NewDropSettings = {
    enabled: false,
    imageUrl: null,
    title: "",
    text: "",
    buttonText: "Shop now",
    buttonLink: "/collections/all",
  };

  const emptyEventsSlider: EventsSliderSettings = {
    enabled: false,
    images: [],
  };

  const emptyHeroCards: { url: string; alt?: string }[] = [];

  const defaultHeroSource: "custom" | "products" = "custom";

  if (!sanityClient) {
    return { countdown: emptyCountdown, heroFloatingCardsSource: defaultHeroSource, heroFloatingCards: emptyHeroCards, newDrop: emptyNewDrop, eventsSlider: emptyEventsSlider };
  }

  try {
    const doc = await sanityClient.fetch<{
      enabled?: boolean;
      endDate?: string | null;
      headline?: string;
      description?: string;
      backgroundMobile?: unknown;
      backgroundTablet?: unknown;
      backgroundDesktop?: unknown;
      heroFloatingCardsSource?: "custom" | "products";
      heroFloatingCards?: Array<{ asset?: { _ref: string }; alt?: string }>;
      newDropEnabled?: boolean;
      newDropImage?: unknown;
      newDropTitle?: string;
      newDropText?: string;
      newDropButtonText?: string;
      newDropButtonLink?: string;
      eventsSliderImages?: Array<{ asset?: { _ref: string }; alt?: string }>;
    } | null>(HOME_QUERY);

    const heroFloatingCardsSource = doc?.heroFloatingCardsSource === "products" ? "products" : "custom";
    const heroCardItems = Array.isArray(doc?.heroFloatingCards) ? doc.heroFloatingCards : [];
    const heroFloatingCards = heroCardItems
      .slice(0, 4)
      .map((img) => {
        const src = img && (img.asset || (img as { _ref?: string })._ref)
          ? imageUrl(img as Parameters<typeof imageUrl>[0])
          : null;
        return src ? { url: src, alt: (img as { alt?: string }).alt ?? "Card" } : null;
      })
      .filter((x): x is { url: string; alt: string } => x != null);

    const countdown: CountdownSettings =
      doc?.enabled && doc?.endDate
        ? {
            enabled: true,
            endDate: doc.endDate,
            headline: doc.headline ?? "Exclusive drop incoming",
            description: doc.description ?? "Get notified when the new cards go live and be the first to grab them.",
            backgroundMobile: imageUrl(doc.backgroundMobile as Parameters<typeof imageUrl>[0]),
            backgroundTablet: imageUrl(doc.backgroundTablet as Parameters<typeof imageUrl>[0]),
            backgroundDesktop: imageUrl(doc.backgroundDesktop as Parameters<typeof imageUrl>[0]),
          }
        : emptyCountdown;

    const newDrop: NewDropSettings =
      doc?.newDropEnabled
        ? {
            enabled: true,
            imageUrl: imageUrl(doc.newDropImage as Parameters<typeof imageUrl>[0]),
            title: doc.newDropTitle ?? "New Drop",
            text: doc.newDropText ?? "",
            buttonText: doc.newDropButtonText ?? "Shop now",
            buttonLink: doc.newDropButtonLink ?? "/collections/all",
          }
        : emptyNewDrop;

    const imageItems = Array.isArray(doc?.eventsSliderImages) ? doc.eventsSliderImages : [];
    const sliderImages = imageItems
      .map((img) => {
        const src = img && (img.asset || (img as { _ref?: string })._ref)
          ? imageUrl(img as Parameters<typeof imageUrl>[0])
          : null;
        return src ? { url: src, alt: (img as { alt?: string }).alt ?? "Event foto" } : null;
      })
      .filter((x): x is { url: string; alt: string } => x != null);
    const eventsSlider: EventsSliderSettings =
      sliderImages.length > 0 ? { enabled: true, images: sliderImages } : emptyEventsSlider;

    return { countdown, heroFloatingCardsSource, heroFloatingCards, newDrop, eventsSlider };
  } catch {
    return { countdown: emptyCountdown, heroFloatingCardsSource: defaultHeroSource, heroFloatingCards: emptyHeroCards, newDrop: emptyNewDrop, eventsSlider: emptyEventsSlider };
  }
}

/** @deprecated Use getHomeSettings() instead */
export async function getCountdownSettings(): Promise<CountdownSettings> {
  const { countdown } = await getHomeSettings();
  return countdown;
}
