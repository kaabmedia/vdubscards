# Analytics — Google Tag Manager + GA4

## Wat in de code zit
- **GTM-container** `GTM-P6QH6S7V` wordt geladen in [`src/app/layout.tsx`](../src/app/layout.tsx)
  (alleen in productie — `process.env.NODE_ENV === "production"`).
- **GA4-property:** `G-CMB8VQPCR3` (gekoppeld ín GTM, niet in code).
- **Funnel-events** worden naar de `dataLayer` gepusht via
  [`src/lib/analytics/gtm.ts`](../src/lib/analytics/gtm.ts):
  | Event | Waar | Bestand |
  |-------|------|---------|
  | `view_item` | productpagina laadt | `components/analytics/TrackViewItem.tsx` |
  | `add_to_cart` | klik op "Add to bag" | `components/shop/AddToCartButton.tsx` |
  | `begin_checkout` | klik op "Checkout" | `app/cart/page.tsx` |
  | `purchase` | **niet hier** — gebeurt op Shopify-checkout | Shopify Admin |

Elk event pusht een GA4-`ecommerce`-object: `{ currency, value, items: [{ item_id, item_name, price, quantity, item_category }] }`.

## Eenmalige setup in het GTM-dashboard (tagmanager.google.com)

### 1. GA4-basis (web traffic)
1. **Tags → New → Google Tag**, Tag ID = `G-CMB8VQPCR3`.
2. Trigger = **Initialization – All Pages**.
3. Naam: `GA4 - Config`. Opslaan.

> Page views (ook bij Next.js client-navigatie) komen binnen via GA4's
> Enhanced Measurement → "Page changes based on browser history events" (staat standaard aan).

### 2. GA4-events (funnel)
Maak een **Data Layer Variable** `ecommerce` (Variables → New → Data Layer Variable, naam `ecommerce`).

Maak voor elk event een **Custom Event Trigger** (Triggers → New → Custom Event) met exact deze namen:
`view_item`, `add_to_cart`, `begin_checkout`.

Maak voor elk event een **GA4 Event tag** (Tags → New → Google Analytics: GA4 Event):
- Configuration tag: `GA4 - Config`
- Event Name: dezelfde naam (`view_item` etc.)
- Onder **More Settings → Ecommerce**: vink **"Send Ecommerce data"** aan, bron = **Data Layer**.
- Trigger: de bijbehorende Custom Event Trigger.

### 3. Publiceren
Rechtsboven **Submit → Publish**. Zonder publiceren vuurt er niks — ook niet de GA4-config.

### 4. Verifiëren
- GTM **Preview** (Tag Assistant) → ga naar vdubscards.com, klik door producten/cart.
- GA4 → **Reports → Realtime** → je ziet jezelf + de events binnenkomen.

## Purchase-event (laatste funnel-stap)
De afrekening gebeurt op het Shopify-domein, niet op deze Next.js-site.
Koppel GA4 daar apart: **Shopify Admin → Online Store / Settings → Customer events**
(of de Google & YouTube-app) met dezelfde GA4-property `G-CMB8VQPCR3`.
Pas dan is de funnel compleet tot en met `purchase`.
