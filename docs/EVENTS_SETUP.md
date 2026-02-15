# Events via Sanity

Events worden opgehaald uit Sanity. Voeg events toe via Sanity Studio.

## 1. Sanity project verbinden ✓

In `.env.local` heb je nodig (met project ID `3rhyio8n` uit je Sanity dashboard):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=3rhyio8n
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=3rhyio8n
SANITY_STUDIO_DATASET=production
```

## 2. Sanity Studio starten

Start de Studio om events toe te voegen:

```bash
npm run studio
```

De Studio opent op **http://localhost:3333**. Log in met je Sanity-account als dat gevraagd wordt.

## 3. Events toevoegen

1. In de Studio: ga naar **Event** in het menu links
2. Klik **Create** → **Event**
3. Vul in:
   - **Naam**: bijv. "Card JunkieZ"
   - **Locatie**: bijv. "Lommel Belgium"
   - **Startdatum**: kies datum (en optioneel tijd)
   - **Einddatum**: optioneel, voor meerdaagse events
   - **Link**: optioneel, URL naar eventpagina of tickets
   - **Volgende event**: vink aan voor het eerste aankomende event
4. Klik **Publish**

De events verschijnen direct op de website (homepage en `/events`).
