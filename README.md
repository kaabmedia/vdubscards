# Vdubscards Webshop

Next.js-webshop met **React**, **Tailwind CSS**, **shadcn/ui**, **Shopify Storefront API** en **Sanity CMS**.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS** + **shadcn/ui** (New York style)
- **Shopify Storefront API** – producten en winkelwagen
- **Sanity** – homepage content (hero, pagina’s)

## Starten

```bash
npm install
cp .env.example .env
# Vul .env in met je Shopify en Sanity gegevens
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Kopieer `.env.example` naar `.env` en vul in:

### Shopify

1. Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app.
2. Configure Storefront API scopes (o.a. `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`).
3. Install app en genereer **Storefront API access token**.
4. Storefront API URL: `https://[store].myshopify.com/api/2024-01/graphql.json`

### Sanity

1. [sanity.io](https://sanity.io) – nieuw project aanmaken.
2. Project ID en dataset (bijv. `production`) in `.env` zetten.
3. Voor een hero op de homepage: in Sanity Studio een document type **page** aanmaken met slug `home` en hero/content invullen.

## Sanity Studio (optioneel)

Voor een lokale Sanity Studio met dezelfde schema’s:

```bash
npm create sanity@latest -- --project-id <JOUW_PROJECT_ID> --dataset production
```

Schema’s staan in `sanity/schemas/` (o.a. `page`, `hero`, `blockContent`). Deze kun je naar je Studio-project kopiëren of de Studio in deze repo mounten.

## Structuur

- `src/app/` – App Router pages (home, producten, product detail, cart)
- `src/components/` – UI (shadcn), layout (Header), shop (ProductGrid, AddToCartButton), cart (CartProvider)
- `src/lib/shopify/` – Storefront API client, queries, types
- `src/lib/sanity/` – Sanity client, image helper, queries
- `sanity/schemas/` – Sanity schema’s (page, hero, blockContent)

## shadcn/ui

Extra componenten toevoegen:

```bash
npx shadcn@latest add [component]
```

## Licentie

Privé / intern gebruik.
