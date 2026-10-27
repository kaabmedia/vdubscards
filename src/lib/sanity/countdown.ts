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

export interface SuppliesSettings {
  enabled: boolean;
  imageUrl: string;
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
  supplies: SuppliesSettings;
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
  suppliesEnabled,
  suppliesImage,
  suppliesTitle,
  suppliesText,
  suppliesButtonText,
  suppliesButtonLink,
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

  // Supplies staat standaard aan: ook zonder Sanity-velden toont de homepage dit blok.
  const defaultSupplies: SuppliesSettings = {
    enabled: true,
    imageUrl: "/supplies.jpg",
    title: "Protect your cards",
    text: "Toploaders, storage cases and more. Everything you need to keep your collection in mint condition.",
    buttonText: "Shop all supplies",
    buttonLink: "/collections/supplies",
  };

  const emptyEventsSlider: EventsSliderSettings = {
    enabled: false,
    images: [],
  };

  const emptyHeroCards: { url: string; alt?: string }[] = [];

  const defaultHeroSource: "custom" | "products" = "custom";

  if (!sanityClient) {
    return { countdown: emptyCountdown, heroFloatingCardsSource: defaultHeroSource, heroFloatingCards: emptyHeroCards, newDrop: emptyNewDrop, supplies: defaultSupplies, eventsSlider: emptyEventsSlider };
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
      suppliesEnabled?: boolean;
      suppliesImage?: unknown;
      suppliesTitle?: string;
      suppliesText?: string;
      suppliesButtonText?: string;
      suppliesButtonLink?: string;
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

    const supplies: SuppliesSettings = {
      enabled: doc?.suppliesEnabled !== false,
      imageUrl: imageUrl(doc?.suppliesImage as Parameters<typeof imageUrl>[0]) ?? defaultSupplies.imageUrl,
      title: doc?.suppliesTitle || defaultSupplies.title,
      text: doc?.suppliesText || defaultSupplies.text,
      buttonText: doc?.suppliesButtonText || defaultSupplies.buttonText,
      buttonLink: doc?.suppliesButtonLink || defaultSupplies.buttonLink,
    };

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

    return { countdown, heroFloatingCardsSource, heroFloatingCards, newDrop, supplies, eventsSlider };
  } catch {
    return { countdown: emptyCountdown, heroFloatingCardsSource: defaultHeroSource, heroFloatingCards: emptyHeroCards, newDrop: emptyNewDrop, supplies: defaultSupplies, eventsSlider: emptyEventsSlider };
  }
}

/** @deprecated Use getHomeSettings() instead */
export async function getCountdownSettings(): Promise<CountdownSettings> {
  const { countdown } = await getHomeSettings();
  return countdown;
}
