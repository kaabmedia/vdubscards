import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID of NEXT_PUBLIC_SANITY_PROJECT_ID is vereist. Voeg toe aan .env.local"
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
